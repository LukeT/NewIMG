import db from '../core/db';
import Sequelize from 'sequelize';

export default db.define('folder', {
	folderName: Sequelize.STRING,
	colour: Sequelize.STRING,
});
