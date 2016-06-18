import fs from 'fs';
import mkdirp from 'mkdirp';

export default class FileTransport {
	constructor(cfg) {
		this.config = cfg;
	}

	get(fileName, directory) {
		const dir = `${this.config.location}/${directory}`;
		return fs.createReadStream(`${dir}/${fileName}`);
	}

	save(data, fileName, directory) {
		const dir = `${this.config.location}/${directory}`;

		mkdirp(dir, (err) => {
			if (err) return;
			data.pipe(fs.createWriteStream(`${dir}/${fileName}`));
		});
	}

	delete(fileName, directory) {
		const dir = `${this.config.location}/${directory}`;

		fs.unlink(`${dir}/${fileName}`);
	}
}
