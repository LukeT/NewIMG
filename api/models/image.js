import db from '../core/db';
import Sequelize from 'sequelize';

export default db.define('image', {
	title: Sequelize.STRING,
	domain: Sequelize.STRING,
	source: Sequelize.STRING,
	views: Sequelize.INTEGER,
	mimeType: Sequelize.STRING,
	enabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: true,
	},
	protected: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
});
