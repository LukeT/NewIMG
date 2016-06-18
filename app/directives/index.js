import angular from 'angular';

import ImgImage from './imgImage';
import ImgFolder from './imgFolder';
import ImgFolderView from './imgFolderView';
import ImgSmartImg from './imgSmartImg';

export default angular.module('newimg.directives', [])
	.directive('imgImage', () => ImgImage)
	.directive('imgFolder', () => ImgFolder)
	.directive('imgFolderView', () => ImgFolderView)
	/* @ngInject */
	.directive('imgSmartImg', ($interpolate) => new ImgSmartImg($interpolate));
