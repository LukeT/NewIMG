import FolderViewCtrl from '../controllers/directives/FolderViewCtrl';

export default {
	restrict: 'E',
	templateUrl: 'directives/imgFolderView.html',
	controller: FolderViewCtrl,
	controllerAs: 'vm',
	bindToController: true,
	scope: {
		active: '=',
		folder: '=',
		currentPos: '=',
	},
};
