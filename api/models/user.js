import db from '../core/db';
import Sequelize from 'sequelize';

export default db.define('user', {
	username: {
		type: Sequelize.STRING,
		unique: true,
	},
	password: Sequelize.STRING,
	email: {
		type: Sequelize.STRING,
		unique: true,
	},
	suspended: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
});
