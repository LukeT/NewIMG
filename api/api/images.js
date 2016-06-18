import config from '../../config.json';
import Transport from '../core/transport';
import Joi from 'joi';
import Boom from 'boom';
import _ from 'lodash';
import Image from '../models/image';
import { default as ImageCreator, format } from '../core/image';
import Folder from '../models/folder';
import hashids from '../core/hashids';

export default [
	{
		method: 'GET',
		path: '/images/{imageSlug}.{ext}',
		handler(request, reply) {
			const id = hashids.decode(request.params.imageSlug)[0];
			if (!id) return reply(Boom.notFound());

			return Image.findById(id)
				.then(item => {
					const image = new ImageCreator(null).setModel(item);

					if (!item || !item.enabled) return reply(Boom.notFound());
					if (request.params.ext !== image.getExtension()) return reply(Boom.notFound());

					const [filename, location] = image.getLocation(request.query.type);

					const stream = new Transport(config.defaultTransport)
						.get(filename, location);

					return reply(stream);
				});
		},
		config: {
			validate: {
				params: {
					imageSlug: Joi.required(),
					ext: Joi.string().required().lowercase(),
				},
				query: {
					type: Joi.string().valid(['full', 'thumb', 'tiny']).default('full'),
				},
			},
		},
	},

	{
		method: 'GET',
		path: '/v1/images',
		handler(request, reply) {
			Image.findAll({
				where: { userId: request.auth.credentials.uid, enabled: true },
				order: 'createdAt DESC',
				include: [Folder],
			}).then(data => {
				reply(_.map(data, (item) => format(request.info.host, item)));
			});
		},
		config: {
			auth: {
				strategy: 'jwt',
			},
		},
	},

	{
		method: 'GET',
		path: '/v1/images/{imageSlug}',
		handler(request, reply) {
			const id = hashids.decode(request.params.imageSlug)[0];
			if (!id) return reply(Boom.notFound());

			return Image.findById(id)
				.then(item => {
					if (!item || !item.enabled) return reply(Boom.notFound());

					return reply(_.map(item, (i) => format(request.info.host, i)));
				}).catch(() => reply(Boom.badImplementation()));
		},
	},

	{
		method: 'PATCH',
		path: '/v1/images/{imageSlug}',
		handler(request, reply) {
			const id = hashids.decode(request.params.imageSlug)[0];
			if (!id) return reply(Boom.notFound());

			return Image.findById(id)
				.then(item => {
					const image = item;
					if (!item) return reply(Boom.notFound());
					if (item.userId !== request.auth.credentials.uid) return reply(Boom.unauthorized());
					if (request.payload.title) image.title = request.payload.title;

					const img = new ImageCreator().setModel(image);

					if (request.payload.folderId || request.payload.folderId === 0) {
						return img.setFolder(request.payload.folderId, request.auth.credentials.uid)
							.then(() => {
								img.getModel().save();
								return reply(format(request.info.host, img));
							})
							.catch(() => reply(Boom.notFound('Folder doesn\'t exist')));
					}

					img.getModel().save();
					return reply(format(request.info.host, img));
				}).catch(() => reply(Boom.badImplementation()));
		},
		config: {
			auth: {
				strategy: 'jwt',
			},

			validate: {
				payload: {
					folderId: Joi.number(),
					title: Joi.string().min(2).max(24),
				},
			},
		},
	},

	{
		method: 'DELETE',
		path: '/v1/images/{imageSlug}',
		handler(request, reply) {
			const id = hashids.decode(request.params.imageSlug)[0];
			if (!id) return reply(Boom.notFound());

			return Image.findById(id)
				.then(item => {
					if (!item) return reply(Boom.notFound());
					if (item.userId !== request.auth.credentials.uid) return reply(Boom.unauthorized());

					return item.destroy().then(() => {
						new ImageCreator().setModel(item).delete();
						return reply({ status: true });
					});
				}).catch(() => reply(Boom.badImplementation()));
		},
		config: {
			auth: {
				strategy: 'jwt',
			},
		},
	},

	{
		method: 'POST',
		path: '/v1/images',
		handler(request, reply) {
			const image = new ImageCreator(request.payload.image);

			if (!image.validMime()) reply(Boom.badData('Uploaded images must be png, jpeg or gif'));

			const uploadedImageData = {
				title: request.payload.title,
				source: request.payload.source,
				fileName: image.getFileName(),
				views: 0,
				userId: request.auth.credentials.uid,
				folderId: request.payload.folderId || null,
				mimeType: image.getMime(),
			};


			if (request.payload.folderId) {
				return Folder.findOne(
					{ where: { userId: request.auth.credentials.uid, id: request.payload.folderId } }
				).then(data => {
					if (!data) return reply(Boom.notFound());

					return image.save(uploadedImageData)
						.then(() => reply(format(request.info.host, image)))
						.catch(() => reply(Boom.badImplementation()));
				});
			}

			return image.save(uploadedImageData)
				.then(() => reply(format(request.info.host, image)));
		},
		config: {
			auth: {
				strategy: 'jwt',
			},
			payload: {
				maxBytes: 20 * (1024 * 1024),
				output: 'stream',
			},
			validate: {
				payload: {
					title: Joi.string().min(2).max(24),
					source: Joi.valid(['web', 'app', 'mobile']).required(),
					folderId: Joi.number(),
					image: Joi.object().required(),
				},
			},
		},
	},
 ];
