import angular from 'angular';

import FileSizeFilter from './fileSize';


export default angular.module('newimg.filters', [])
	.filter('fileSize', FileSizeFilter);
