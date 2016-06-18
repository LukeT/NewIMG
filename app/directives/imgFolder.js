import FolderCtrl from '../controllers/directives/FolderCtrl';

export default {
	restrict: 'E',
	templateUrl: 'directives/imgFolder.html',
	controller: FolderCtrl,
	controllerAs: 'vm',
	bindToController: true,
	scope: {
		folder: '=',
		folders: '=',
		setActive: '&',
		isActive: '=',
	},
};
