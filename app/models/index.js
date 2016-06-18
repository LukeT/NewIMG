import angular from 'angular';

import AppModel from './app';
import AuthModel from './auth';
import ImagesModel from './images';
import FoldersModel from './folders';
import UsersModel from './users';

export default angular.module('newimg.models', [])
	/* @ngInject */
	.factory('AuthModel', ($http) => new AuthModel($http))
	.factory('AppModel', ($http) => new AppModel($http))
	.factory('ImagesModel', ($http) => new ImagesModel($http))
	.factory('FoldersModel', ($http) => new FoldersModel($http))
	.factory('UsersModel', ($http) => new UsersModel($http));
