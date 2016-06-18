import _ from 'lodash';
import config from '../../../config.json';

export default class UploadModal {
	_initialize($element, close, $rootScope, Upload, $timeout) {
		this._element = $element;
		this._close = close;
		this._rootScope = $rootScope;
		this._upload = Upload;
		this._timeout = $timeout;
	}

	/* @ngInject */
	constructor($element, $scope, close, $rootScope, Upload, $timeout) {
		this._initialize($element, close, $rootScope, Upload, $timeout);
	}

	updateFileNames(files) {
		this.files = _.forEach(files, (i) => {
			const file = i;
			file.percent = 0;

			if (!i.metaName) {
				file.metaName = i.name.substring(0, 24);
			}

			return file;
		});
	}

	upload() {
		this.lock = true;

		const uploads = this.files.map(image => new Promise(resolve => {
			this._upload.upload({
				url: `${config.urls.api}/images`,
				data: {
					image,
					title: image.metaName,
					source: 'web',
				},
			}).then((evt) => { // The Image has uploaded!
				this._timeout(() => {
					this.files.splice(_.indexOf(this.files, evt.config.data.image), 1); // image? what image
					this._rootScope.$emit('ImageUploaded', evt.data);
					resolve();
				}, 1000);
			}, evt => { // Something went wrong.
				resolve();
				evt.config.data.image.progress = 0; //eslint-disable-line
			}, (evt) => { // Progress Update
				evt.config.data.image.percent = parseInt(100.0 * evt.loaded / evt.total, 10); //eslint-disable-line
			});
		}));

		Promise.all(uploads).then(() => {
			this.lock = false;

			if (!this.files.length) {
				this._timeout(() => {
					this.close();
				}, 500);
			} else {
				console.log(" Uploads Failed: " + this.files.length);
			}
		});
	}

	close() {
		this._rootScope.modalBlur = true;
		this._element.addClass('modal--hide');
		this._close(true, 550);
	}
}
