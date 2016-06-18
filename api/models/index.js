import Folder from './folder';
import User from './user';
import Image from './image';

const models = { Folder, User, Image };

models.User.hasMany(models.Image);
models.Image.belongsTo(models.User);

models.User.hasMany(models.Folder);
models.Folder.belongsTo(models.User);

models.Folder.hasMany(models.Image);
models.Image.belongsTo(models.Folder);

export default models;
