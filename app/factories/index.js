import angular from 'angular';

import CurrentUser from './currentUser';

export default angular.module('newimg.factories', [])
	/* @ngInject */
	.factory('currentUser',
		(localStorageService, md5, $http) => new CurrentUser(localStorageService, md5, $http)
	);
