export default class FolderViewCtrl {
	_initialize(FoldersModel) {
		this._folders = FoldersModel;
	}

	/* @ngInject */
	constructor($scope, FoldersModel) {
		this._initialize(FoldersModel);

		this.images = false;

		$scope.$watch(
			() => this.active,
			() => {
				if (!this.active) this.images = false;

				if (
					this.active !== false &&
					this.active >= this.currentPos - 2 &&
					this.active <= this.currentPos
				) {
					this._getImages();
				} else {
					this.images = false;
				}
			}, true
		);
	}

	_getImages() {
		this.images = [];
		this._folders.getImages(this.folder.id)
			.then(data => {
				this.images = data;
			});
	}
}
