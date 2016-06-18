import MoveFolderModalCtrl from '../modals/MoveFolderModalCtrl';

export default class ImageCtrl {
	_initialize(clipboard, ImagesModel, ModalService, $rootScope) {
		this._images = ImagesModel;
		this._clipboard = clipboard;
		this._modalService = ModalService;
		this._rootScope = $rootScope;
	}

	/* @ngInject */
	constructor(clipboard, ImagesModel, ModalService, $rootScope) {
		this._initialize(clipboard, ImagesModel, ModalService, $rootScope);
		this.menu = false;
	}

	toggleMenu() {
		this.menu = !this.menu;
	}

	copyURL() {
		this.toggleMenu();

		if (!this._clipboard.supported) {
			return alert(`http:${this.image.imageUrl}`) // eslint-disable-line
		}

		return this._clipboard.copyText(`http:${this.image.imageUrl}`);
	}

	moveFolder() {
		this.toggleMenu();
		this._rootScope.modal = true;

		this._modalService.showModal({
			templateUrl: 'modals/moveFolder.html',
			controller: MoveFolderModalCtrl,
			controllerAs: 'modal',
			inputs: {
				image: this.image,
			},
		}).then(modal => {
			modal.close.then(() => {
				this._rootScope.modal = false;
				this._rootScope.modalBlur = false;
			});
		});
	}

	removeFromFolder() {
		this._images.update(this.image.slug, { folderId: 0 })
			.then(() => {
				this.images.splice(this.images.indexOf(this.image), 1);
			});
	}

	changeTitle() {
		this._images.update(this.image.slug, {
			title: this.image.title,
		});
	}

	delete() {
		this._images.delete(this.image.slug)
			.then(() => {
				this.images.splice(this.images.indexOf(this.image), 1);
			});
	}
}
