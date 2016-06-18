import hapi from 'hapi';
import jwt from 'hapi-auth-jwt2';
import Inert from 'inert';

import config from './config.json';
import sql from './api/core/db';
import readFiles from './api/core/readFiles';
import jwtConfig from './api/modules/jwt';

import './api/models';

sql.sync();

const server = new hapi.Server();
const files = readFiles('api/api');

server.connection({ port: config.web.port });

server.register(jwt);
server.register(Inert);

// JWT Authentication
server.auth.strategy('jwt', 'jwt', {
	key: config.web.jwt,
	validateFunc: jwtConfig,
	verifyOptions: { algorithms: ['HS256'], ignoreExpiration: true },
});

// Generate a static route for AngularJs
function generateStaticApp(type) {
	server.route({
		method: 'GET',
		path: `/app/${type}/{param*}`,
		handler: {
			directory: {
				path: `./build_app/${type}`,
			},
		},
	});
}

function generateStaticSite(type) {
	server.route({
		method: 'GET',
		path: `/${type}/{param*}`,
		handler: {
			directory: {
				path: `./build_site/${type}`,
			},
		},
	});
}


['css', 'images', 'fonts', 'js'].forEach(generateStaticApp);
['css', 'images', 'fonts', 'js'].forEach(generateStaticSite);

// Redirect all other app routes to index.html
server.route({
	method: 'GET',
	path: '/app/{param*}',
	handler: {
		file: './build_app/index.html',
	},
});

// API Handler
files.forEach(file => {
	server.route(file);
});

server.start(err => {
	if (err) throw err;
	console.log("NewIMG Server Started."); //eslint-disable-line
});
