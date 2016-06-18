import FileTransport from './transports/file';
import config from '../../config.json';

const transports = {
	file: FileTransport,
};

export default class Transport {
	constructor(type) {
		this.config = config;

		if (transports[type]) {
			this.transport = new transports[type](this.config.transports[type]);
		}
	}

	_getTransport() {
		return this.transport;
	}

	get(...args) {
		return this.transport.get(...args);
	}

	save(...args) {
		return this.transport.save(...args);
	}

	delete(...args) {
		return this.transport.delete(...args);
	}
}
