import angular from 'angular';

import NewImgCtrl from './app/NewImgCtrl';
import NavCtrl from './layout/NavCtrl';
import FoldersCtrl from './app/FoldersCtrl';
import UploadsCtrl from './app/UploadsCtrl';
import LoginCtrl from './auth/LoginCtrl';
import SignupCtrl from './auth/SignupCtrl';

export default angular.module('newimg.controllers', [])
	.controller('NewImgCtrl', NewImgCtrl)
	.controller('NavCtrl', NavCtrl)
	.controller('FoldersCtrl', FoldersCtrl)
	.controller('UploadsCtrl', UploadsCtrl)
	.controller('LoginCtrl', LoginCtrl)
	.controller('SignupCtrl', SignupCtrl);
