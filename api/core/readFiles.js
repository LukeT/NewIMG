import fs from 'fs';

export default (directory) => {
	const directories = [];

	fs.readdirSync(directory).forEach(file => {
		directories.push(require(`../api/${file}`).default);
	});

	return directories;
};
