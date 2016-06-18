import AccountModal from '../modals/AccountModalCtrl';
import FolderSettingsModal from '../modals/FolderSettingsModalCtrl';
import UploadModal from '../modals/UploadModalCtrl';

export default class NavCtrl {
	_initialize($rootScope, ModalService, $state) {
		this._rootScope = $rootScope;
		this._modalService = ModalService;
		this._state = $state;
	}

	/* @ngInject */
	constructor($state, $rootScope, ModalService) {
		this._initialize($rootScope, ModalService, $state);

		this.activeMenu = $state.current.name;

		$rootScope.$on('$stateChangeSuccess', () => {
			this.activeMenu = $state.current.name;
		});
	}

	showAccountModal() {
		this._rootScope.modal = true;

		this._modalService.showModal({
			templateUrl: 'modals/profile.html',
			controller: AccountModal,
			controllerAs: 'modal',
		}).then(modal => {
			modal.close.then(() => {
				this._rootScope.modal = false;
				this._rootScope.modalBlur = false;
			});
		});
	}

	addFolder() {
		this._rootScope.modal = true;

		this._modalService.showModal({
			templateUrl: 'modals/folderSettings.html',
			controller: FolderSettingsModal,
			controllerAs: 'modal',
			inputs: {
				folder: null,
			},
		}).then(modal => {
			modal.close.then(data => {
				this._rootScope.modal = false;
				this._rootScope.modalBlur = false;

				if (data.id) {
					this._rootScope.$emit('FolderCreated', data);
				}
			});
		});
	}

	uploadImage() {
		this._rootScope.modal = true;

		this._modalService.showModal({
			templateUrl: 'modals/uploadModal.html',
			controller: UploadModal,
			controllerAs: 'modal',
		}).then(modal => {
			modal.close.then(data => {
				this._rootScope.modal = false;
				this._rootScope.modalBlur = false;
				this._state.go(this._state.current.name, this._state.params, { reload: true });

				// if (data.length !== 0) {
				// 	data.forEach(i => this._rootScope.$emit('ImageCreated', i));
				// }
			});
		});
	}
}
