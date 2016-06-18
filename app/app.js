import angular from 'angular';
import router from './config/router';
import localStorage from './config/localStorage';
import _ from 'lodash';

import 'angular-animate';
import 'angular-clipboard';
import 'angular-local-storage';
import 'angular-md5';
import 'angular-modal-service';
import 'angular-moment';
import 'angular-ui-router';
import 'ng-file-upload';

import './controllers';
import './directives';
import './factories';
import './filters';
import './models';
import './templates';

const modules = [
	'angular-clipboard',
	'angular-md5',
	'angularModalService',
	'angularMoment',
	'ui.router',
	'LocalStorageModule',
	'ngAnimate',
	'templates',
	'ngFileUpload',

	'newimg.controllers',
	'newimg.directives',
	'newimg.factories',
	'newimg.filters',
	'newimg.models',
];

angular.module('newimg', modules)
	.constant('_', _)
	.config(router)
	.config(localStorage)
	.run(($rootScope) => {
		const $r = $rootScope;
		$rootScope.$on('$stateChangeSuccess', (event, toState) => {
			$r.pageTitle = (toState.title) ? `${toState.title} - NewIMG` : 'NewIMG';
		});
	});
