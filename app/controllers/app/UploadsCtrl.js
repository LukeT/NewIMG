export default class UploadsCtrl {

	_initialize(ImagesModel) {
		this._images = ImagesModel;
	}

	/* @ngInject */
	constructor($rootScope, ImagesModel) {
		this._initialize(ImagesModel);
		this._getImages();

		$rootScope.$on('ImageUploaded', (event, data) => {
			const image = data;
			image.imported = true;
			this.images.unshift(image);
		});
	}

	_getImages() {
		this._images.get(0, 20)
			.then(data => {
				this.images = data;
			});
	}
}
