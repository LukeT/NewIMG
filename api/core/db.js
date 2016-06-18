import Sequelize from 'sequelize';
import config from '../../config.json';

export default new Sequelize(config.db.db, config.db.username, config.db.password, {
	host: config.db.hostname,
	dialect: 'mysql',
});
