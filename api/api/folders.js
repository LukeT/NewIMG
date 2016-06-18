import Joi from 'joi';
import Boom from 'boom';
import _ from 'lodash';
import Folder from '../models/folder';
import Image from '../models/image';
import sequelize from 'sequelize';
import { format, folderKeys } from '../core/image';

export default [
	{
		method: 'GET',
		path: '/v1/folders',
		handler(request, reply) {
			Folder.findAll({
				where: {
					userId: request.auth.credentials.uid,
				},
				order: 'createdAt DESC',
				include: [{
					model: Image,
					attributes: ['id', 'mimeType', 'folderId'],
					required: false,
					limit: 9,
					order: [
						[sequelize.fn('RAND', '')],
					],
				}],
			}).then(data => {
				reply(_.map(data, (item) => _.set(
					_.pick(item, folderKeys),
					'images',
					_.map(
						item.images,
						(value) => `${format(request.info.host, value).imageUrl}?type=tiny`
					)
				)));
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
		path: '/v1/folders/{folderName}/images',
		handler(request, reply) {
			Folder.findOne({
				where: {
					userId: request.auth.credentials.uid,
					id: request.params.folderName,
				},
				include: [{
					model: Image,
					required: false,
					order: 'createdAt desc',
				}],
			}).then(data => {
				if (!data) return reply(Boom.notFound());
				return reply(_.map(
						data.images,
						(value) => format(request.info.host, value)
					));
			}).catch(reply);
		},
		config: {
			auth: {
				strategy: 'jwt',
			},
			validate: {
				params: {
					folderName: Joi.number(),
				},
			},
		},
	},


	{
		method: 'GET',
		path: '/v1/folders/{folderName}',
		handler(request, reply) {
			Folder.findOne({
				where: {
					userId: request.auth.credentials.uid,
					id: request.params.folderName,
				},

			}).then(data => {
				if (!data) return reply(Boom.notFound());
				return reply(_.pick(data, folderKeys));
			}).catch(reply);
		},
		config: {
			auth: {
				strategy: 'jwt',
			},
			validate: {
				params: {
					folderName: Joi.number(),
				},
			},
		},
	},

	{
		method: 'POST',
		path: '/v1/folders',
		handler(request, reply) {
			const folder = _.pick(request.payload, ['folderName', 'colour']);
			folder.userId = request.auth.credentials.uid;

			Folder.create(folder)
				.then(data => {
					reply(data);
				}).catch(reply);
		},
		config: {
			auth: {
				strategy: 'jwt',
			},
			validate: {
				payload: {
					folderName: Joi.string().required().min(1).max(24),
					colour: Joi.valid(['purple', 'red', 'orange', 'blue', 'green', 'pink']).default('purple'),
				},
			},
		},
	},

	{
		method: 'PATCH',
		path: '/v1/folders/{folderName}',
		handler(request, reply) {
			Folder.findOne({
				where: {
					userId: request.auth.credentials.uid,
					id: request.params.folderName,
				},
			}).then(data => {
				if (!data) return reply(Boom.notFound());

				const folder = data;

				if (request.payload.folderName) folder.folderName = request.payload.folderName;
				if (request.payload.colour) folder.colour = request.payload.colour;

				folder.save();

				return reply(_.pick(folder, folderKeys));
			}).catch(reply);
		},
		config: {
			auth: {
				strategy: 'jwt',
			},
			validate: {
				payload: {
					folderName: Joi.string().min(1).max(24),
					colour: Joi.any().allow(['purple', 'red', 'orange', 'blue', 'green', 'pink']),
				},
			},
		},
	},

	{
		method: 'DELETE',
		path: '/v1/folders/{folderName}',
		handler(request, reply) {
			Folder.destroy({
				where: {
					id: request.params.folderName,
					userId: request.auth.credentials.uid,
				},
			}).then(() => {
				reply({ status: true });
			});
		},
		config: {
			auth: {
				strategy: 'jwt',
			},
			validate: {
				params: {
					folderName: Joi.number(),
				},
			},
		},
	},
 ];
