import Joi from 'joi';
import Boom from 'boom';
import _ from 'lodash';
import User from '../models/user';
import bcrypt from 'bcrypt';

const authenticatedKeys = ['id', 'username', 'email', 'suspended', 'createdAt', 'updatedAt'];
const unauthenticatedKeys = ['id', 'username', 'suspended', 'createdAt', 'updatedAt'];

export default [
	{
		method: 'GET',
		path: '/v1/users',
		handler(request, reply) {
			return User.findAll({ where: { id: request.auth.credentials.uid } })
				.then(data => reply(_.pick(data[0], authenticatedKeys)));
		},
		config: {
			auth: {
				strategy: 'jwt',
			},
		},
	},

	{
		method: 'GET',
		path: '/v1/users/{username}',
		handler(request, reply) {
			return User.findAll({ where: { username: request.params.username } })
				.then(data => {
					if (data.length !== 1) {
						return reply(Boom.notFound());
					}
					return reply(_.pick(data[0], unauthenticatedKeys));
				});
		},
		config: {
			validate: {
				params: {
					username: Joi.string().min(3).max(24).required(),
				},
			},
		},
	},

	{
		method: 'POST',
		path: '/v1/users/{userID}/password',
		handler(request, reply) {
			User.findById(request.auth.credentials.uid).then(user => {
				if (!user) return Promise.reject(Boom.badImplementation());
				return user;
			}).then(user => bcrypt.compareAsync(request.payload.oldPassword, user.password)
				.then(match => {
					if (!new RegExp(`^${user.username}$`, 'i').test(request.params.userID) || !match) {
						return Promise.reject(Boom.forbidden(
							(!match) ? 'Incorrect Password' : 'User doesn\'t exist.')
						);
					}

					return user;
				}).catch(reply)
			).then(user => bcrypt.hashAsync(request.payload.newPassword, 8)
				.then(password => user.update({ password }))
			).then(resp => {
				if (resp) return reply({ status: true });

				return reply(Boom.badImplementation());
			}).catch(reply);
		},
		config: {
			auth: {
				strategy: 'jwt',
			},
			validate: {
				payload: {
					oldPassword: Joi.string().min(3).required(),
					newPassword: Joi.string().min(3).required(),
				},
			},
		},
	},
];
