import ImageCtrl from '../controllers/directives/ImageCtrl';

export default {
	restrict: 'E',
	templateUrl: 'directives/imgImage.html',
	controller: ImageCtrl,
	controllerAs: 'vm',
	bindToController: true,
	scope: {
		image: '=',
		images: '=',
		origin: '=',
	},
};
