import _ from 'lodash';

export default class FolderSettingsModelCtrl {
	_initialize($element, close, $rootScope, folder, FoldersModel) {
		this._element = $element;
		this._close = close;
		this._rootScope = $rootScope;
		this._folder = FoldersModel;
		this.folder = folder;
	}

	/* @ngInject */
	constructor($element, close, $rootScope, folder, FoldersModel) {
		this._initialize($element, close, $rootScope, folder, FoldersModel);
		this._folderCache = _.clone(folder);

		if (!folder) {
			this._loadDefaults();
		}
	}

	_loadDefaults() {
		this.folder = {
			colour: 'purple',
		};

		this._folderCache = _.clone(this.folder);
	}

	setColour(colour) {
		this.folder.colour = colour;
	}

	save() {
		this._folder.update(this.folder.id, _.pick(this.folder, ['folderName', 'colour']))
			.then(() => {
				this.close(true);
			});
	}

	create() {
		this._folder.insert(_.pick(this.folder, ['folderName', 'colour']))
			.then(data => {
				this.close(true, data);
			});
	}

	close(saved, data) {
		if (!saved) {
			this.folder.folderName = this._folderCache.folderName;
			this.folder.colour = this._folderCache.colour;
		}

		this._rootScope.modalBlur = true;
		this._element.addClass('modal--hide');
		this._close(data || true, 550);
	}
}
