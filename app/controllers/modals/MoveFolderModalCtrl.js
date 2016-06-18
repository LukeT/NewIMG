export default class MoveFolderModalCtrl {
	_initialize($element, close, $rootScope, FoldersModel, ImagesModel, image) {
		this._element = $element;
		this._close = close;
		this._rootScope = $rootScope;
		this._images = ImagesModel;
		this._folders = FoldersModel;
		this.image = image;
	}

	/* @ngInject */
	constructor($element, close, $rootScope, FoldersModel, ImagesModel, image) {
		this._initialize($element, close, $rootScope, FoldersModel, ImagesModel, image);
		if (image.folder.id) {
			this.image._activeFolder = image.folder;
			this.image.folderId = image.folder.id;
		}
		this._getFolders();
	}

	_getFolders() {
		this._folders.all()
			.then(data => {
				this.folders = data;
			});
	}

	activeFolder(i) {
		return this.image.folderId === i;
	}

	makeActive(folder) {
		this._activeFolder = folder;
		this.image.folderId = folder.id;
	}

	save() {
		this._images.update(this.image.slug, { folderId: this.image.folderId })
			.then(() => {
				if (this._activeFolder) this.image.folder = this._activeFolder;
				this.close();
			});
	}

	close() {
		this._rootScope.modalBlur = true;
		this._element.addClass('modal--hide');
		this._close(true, 550);
	}
}
