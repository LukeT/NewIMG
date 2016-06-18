import Promise from 'bluebird';
import Joi from 'joi';
import aguid from 'aguid';
import _ from 'lodash';
import JWT from 'jsonwebtoken';
import Boom from 'boom';
import User from '../models/user';
import redis from '../core/redis';
import config from '../../config.json';

const bcrypt = Promise.promisifyAll(require('bcrypt'));
const userKeys = ['username', 'email', 'password', 'newsletter'];
const authenticatedKeys = ['id', 'username', 'email', 'suspended', 'createdAt', 'updatedAt'];

export default [
	{
		method: 'POST',
		path: '/v1/auth/login',
		handler(request, reply) {
			User.findAll({
				where: {
					$or: [
						{ username: request.payload.username },
						{ email: request.payload.username },
					],
				},
			}).then(user => {
				if (user.length !== 1) return Promise.reject(Boom.notFound());

				return user[0];
			}).then(user => bcrypt.compareAsync(request.payload.password, user.password)
					.then(match => {
						if (!match) return Promise.reject(Boom.forbidden());
						return user;
					})
			).then(userModel => {
				const req = {
					sid: aguid(), // who is sid
					uid: userModel.id,
					exp: new Date().getTime() + (3600 * 24 * 7 * 1000),
				};

				redis.client.setex(`${redis.baseKey}:jwt:${req.sid}`, Math.floor(req.exp / 1000), true);

				const token = JWT.sign(req, config.web.jwt);
				const user = _.pick(userModel, authenticatedKeys);

				reply({ token, user });
			}).catch(reply);
		},
		config: {
			validate: {
				payload: {
					username: Joi.string().min(3).max(24).required(),
					password: Joi.string().min(3).required(),
				},
			},
		},
	},

	{
		method: 'POST',
		path: '/v1/auth/signup',
		handler(request, reply) {
			return User.findAll({
				where: { username: request.payload.username },
			}).then(data => {
				if (data.length) {
					return Promise.reject(Boom.badRequest('username in use'));
				}
				return false;
			}).then(() => User.findAll({
				where: { email: request.payload.email },
			})).then(data => {
				if (data.length) {
					return Promise.reject(Boom.badRequest('email in use'));
				}
				return false;
			}).then(() => bcrypt.hashAsync(request.payload.password, 8))
			.then((password) => {
				const user = _.pick(_.set(request.payload, 'password', password), userKeys);
				return User.create(user);
			}).then((user) => reply(_.pick(user, authenticatedKeys))).catch(reply);
		},
		config: {
			validate: {
				payload: {
					username: Joi.string().min(3).max(24).required(),
					password: Joi.string().min(3).required(),
					email: Joi.string().email().required(),
				},
			},
		},
	},
];
