export default class UploadsCtrl {

	_initialize(FoldersModel) {
		this._folders = FoldersModel;
		this.activeFolder = false;
		this.Math = window.Math; // Hacks.
	}

	/* @ngInject */
	constructor(FoldersModel, $rootScope) {
		this._initialize(FoldersModel);
		this._getFolders();

		$rootScope.$on('FolderCreated', (event, data) => {
			this.folders.unshift(data);
		});
	}

	setActive(folder) {
		this.activeFolder = (folder === this.activeFolder) ? false : folder;
	}

	isActive(folder) {
		return folder === this.activeFolder;
	}

	_getFolders() {
		this._folders.all(0, 20)
			.then(data => {
				this.folders = data;
			});
	}

}
