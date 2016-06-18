import _ from 'lodash';
import config from '../../config.json';
import User from '../models/user';

const authenticatedKeys = ['id', 'username', 'email', 'suspended', 'createdAt', 'updatedAt'];

export default [
	{
		method: 'GET',
		path: '/v1/app',
		handler(request, reply) {
			const isAuthenticated = request.auth.isAuthenticated;

			const app = {
				baseURL: config.urls.uploads,
				authenticated: isAuthenticated,
			};

			if (isAuthenticated) {
				return User.findOne({ where: { id: request.auth.credentials.uid } })
					.then(data => {
						if (!data) {
							app.authenticated = false;
						} else {
							app.user = _.pick(data, authenticatedKeys);
						}
						return reply(app);
					});
			}

			return reply(app);
		},
		config: {
			auth: {
				strategy: 'jwt',
				mode: 'optional',
			},
		},
	},
];
