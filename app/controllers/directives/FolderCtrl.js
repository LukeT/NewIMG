import FolderSettingsModalCtrl from '../modals/FolderSettingsModalCtrl';

export default class FolderCtrl {
	_initialize($scope, $rootScope, ModalService, FoldersModel) {
		this._scope = $scope;
		this._modalService = ModalService;
		this._rootScope = $rootScope;
		this._folders = FoldersModel;
	}

	/* @ngInject */
	constructor($scope, $rootScope, ModalService, FoldersModel) {
		this._initialize($scope, $rootScope, ModalService, FoldersModel);
		this.menu = false;
	}

	toggleMenu() {
		this.menu = !this.menu;
	}

	makeActive() {
		this.setActive();
	}

	getClass() {
		return {
			active: !!this.isActive,
			[`card-${this.folder.colour}`]: true,
		};
	}

	settings() {
		this.toggleMenu();
		this._rootScope.modal = true;

		this._modalService.showModal({
			templateUrl: 'modals/folderSettings.html',
			controller: FolderSettingsModalCtrl,
			controllerAs: 'modal',
			inputs: {
				folder: this.folder,
			},
		}).then(modal => {
			modal.close.then(() => {
				this._rootScope.modal = false;
				this._rootScope.modalBlur = false;
			});
		});
	}

	delete() {
		this._folders.delete(this.folder.id)
			.then(() => {
				this.folders.splice(this.folders.indexOf(this.folder), 1);
			});
	}
}
