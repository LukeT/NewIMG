import Transport from './transport';
import Image from '../models/image';
import Folder from '../models/folder';
import config from '../../config.json';
import moment from 'moment';
import gm from 'gm';
import hashids from './hashids';
import _ from 'lodash';

// Valid mime types.
const validMimes = [
	'image/jpeg',
	'image/png',
	'image/gif',
];

// Public model keys.
const imageKeys = [
	'title',
	'source',
	'views',
	'enabled',
	'protected',
	'folder', // in the case where we include relations
	'folderId',
	'createdAt',
	'updatedAt',
];

// Size we should be resizing images to
const resizeSize = {
	width: 300,
	height: 250,
};

const tinySize = {
	height: (resizeSize.height + 30) / 3, // Compenstate for positioning
	width: (resizeSize.width + 30) / 3,
};

// Coresponding formats of images
const mimeFormats = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/gif': 'gif',
};

export const folderKeys = [
	'id',
	'folderName',
	'colour',
	'createdAt',
	'updatedAt',
];

/**
 * Build object to be returned via API.
 *
 * @method format
 * @param  {String} url   API URL
 * @param  {Object} model Image Object
 * @return {Object}       The full object.
 */
export function format(url, image) {
	const model = image.model || image;
	const items = _.pick(model, imageKeys);
	const ext = mimeFormats[model.mimeType];

	items.slug = hashids.encode(model.id);
	items.imageUrl = `//${url}/images/${items.slug}.${ext}`;

	if (items.folder || items.folder === null) {
		items.folder = _.pick(items.folder, folderKeys);
		delete items.folderId;
	}

	return items;
}

export default class ImageCreator {

	constructor(image) {
		this.image = image;
		this.transport = new Transport(config.defaultTransport);
	}

	/**
	 * Return the headers of the uploaded headers
	 *
	 * @method _getHeaders
	 * @return {Object}    All the headers passed with the uploaded image.
	 */
	_getHeaders() {
		return this.image.hapi.headers;
	}

	/**
	* Remove exif data from the image.
	*
	* @method _getImage
	* @return {Stream}  The exif-less image.
	*/
	_getImage() {
		return gm(this.image, `${this.model.id}.${this.getExtension()}`)
		.noProfile()
		.stream();
	}

	/**
	* Resize the image, ensuring the resulting image is the
	* correct size.
	*
	* @method _resize
	* @param  {Stream} image The image we wish to resize
	* @return {Stream}       The resized image as a stream
	*/
	_resize(image) {
		return gm(image)
			.resize(resizeSize.width, resizeSize.height) // Resize
			.background('transparent') // Transparent Canvas
			.gravity('Center') // Center the image
			.extent(resizeSize.width, resizeSize.height) // Redraw to force size
			.stream();
	}


	/**
	* Resize the image, ensuring the resulting image is the
	* correct size.
	*
	* @method _resize
	* @param  {Stream} image The image we wish to resize
	* @return {Stream}       The resized image as a stream
	*/
	_tiny(image, cb) {
		const img = gm(image);

		return img.size({ bufferStream: true }, (err, size) => {
			const scaleWidth = size.width / tinySize.width;
			const scaleHeight = size.height / tinySize.height;
			const scale = (scaleHeight < scaleWidth) ? scaleHeight : scaleWidth;
			const height = (size.height / scale);
			const width = (size.width / scale);


			cb(null, img
				.resize(width, height)
				.background('transparent') // Transparent Canvas
				.gravity('Center') // Center the image
				.crop(tinySize.width, tinySize.height)
				.stream()); // Redraw to force size
		});
	}

	/**
	 * Get the file extension of the image
	 *
	 * @method getExtension
	 * @return {String}      The file extension of the file.
	 */
	getExtension() {
		return mimeFormats[this.getMime()];
	}

	/**
	* Fetch the user defined image filename.
	*
	* @method _getFileName
	* @return {String}     The users filename.
	*/
	getFileName() {
		if (!this.image) return '';
		return this.image.hapi.filename;
	}

	/**
	 * Set the DB model to be dealing with.
	 *
	 * @method setModel
	 * @param  {Image} dbModel The DB model for the image.
	 */
	setModel(dbModel) {
		this.model = dbModel;
		return this;
	}

	/**
	 * Get the raw model
	 *
	 * @method getModel
	 * @return {Object} Sequelize Model
	 */
	getModel() {
		return this.model;
	}

	/**
	 * Get the mime type by either loading the uploaded image
	 * or the one from the model.
	 *
	 * @method getMime
	 * @return {String} The images mime type
	 */
	getMime() {
		if (this.validMime()) return this._getHeaders()['content-type'];
		if (this.model) return this.model.mimeType;
		return '';
	}

	/**
	 * Check whether the mime is valid
	 *
	 * @method validMime
	 * @return {Boolean}  Is the mimetype valid.
	 */
	validMime() {
		if (!this.image) return false;

		const mime = this._getHeaders()['content-type'];
		return !!validMimes.find(x => x === mime);
	}


	/**
	 * Get the file name and path of the image.
	 *
	 * @method getLocation
	 * @param  {Boolean}     resize Whether we should be resizing the image.
	 * @return {Array}              The path and file name of the image.
	 */
	getLocation(resize) {
		const directory = [
			(this.model.userId === null) ? 'anonymous' : `users/${this.model.userId}`,
			moment(this.model.createdAt).utc().get('year'),
			moment(this.model.createdAt).utc().get('month') + 1, // Avoid the whole, starting at 0 thing.
			moment(this.model.createdAt).utc().get('date'),
			moment(this.model.createdAt).utc().get('hour'),
		].join('/');

		const filename = [
			`image-${this.model.id}`,
			resize || 'full',
			mimeFormats[this.getMime()],
		].join('.');

		return [filename, directory];
	}

	/**
	 * Save the image.
	 *
	 * @method save
	 * @param  {Object} data The data we're trying to save.
	 * @return {Promise}     The callback fron sequelize
	 */
	save(data) {
		return Image.create(data)
			.then(model => {
				this.model = model;
				this.write();
			});
	}

	setFolder(folderId, uid) {
		if (folderId === 0) {
			return new Promise((resolve) => {
				this.model.folderId = null;
				resolve();
			});
		}

		return new Promise(
			(resolve, reject) => Folder.findOne(
				{ where: { userId: uid, id: folderId } }
			).then(data => {
				if (!data) return reject();

				this.model.folderId = folderId;
				return resolve();
			}));
	}

	/**
	 * Write the files to dis
	 *
	 * @method write
	 */
	write() {
		if (!this.image) return;

		const [imageName, imageLocation] = this.getLocation();
		const [resizeName, resizeLocation] = this.getLocation('thumb');
		const [tinyName, tinyLocation] = this.getLocation('tiny');

		const image = this._getImage();
		const resized = this._resize(image);
		this._tiny(image, (err, data) => {
			this.transport.save(data, tinyName, tinyLocation);
		});

		this.transport.save(image, imageName, imageLocation);
		this.transport.save(resized, resizeName, resizeLocation);
	}

	delete() {
		const [imageName, imageLocation] = this.getLocation();
		const [resizeName, resizeLocation] = this.getLocation('thumb');
		const [tinyName, tinyLocation] = this.getLocation('tiny');

		this.transport.delete(tinyName, tinyLocation);
		this.transport.delete(imageName, imageLocation);
		this.transport.delete(resizeName, resizeLocation);
	}
}
