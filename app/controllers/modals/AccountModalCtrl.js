export default class AccountModalCtrl {
	_initialize($element, close, $rootScope, UsersModel) {
		this._element = $element;
		this._close = close;
		this._rootScope = $rootScope;
		this._users = UsersModel;
	}

	/* @ngInject */
	constructor($element, close, $rootScope, currentUser, UsersModel) {
		this._initialize($element, close, $rootScope, UsersModel);

		this.error = '';
		this.account = currentUser.get();
		this.account.avatar = currentUser.getAvatar();
	}

	changePassword() {
		if (this.newPassword && this.oldPassword && this.passwordForm.$valid) {
			return this._users.changePassword(this.account.username, {
				oldPassword: this.oldPassword,
				newPassword: this.newPassword,
			}).then(() => {
				this.error = '';
				this.close();
			}).catch(() => {
				this.error = 'Please make sure your current password is correct.';
			});
		}

		if (!this.newPassword && !this.oldPassword) {
			return this.close();
		}

		return null;
	}
	close() {
		this._rootScope.modalBlur = true;
		this._element.addClass('modal--hide');
		this._close(true, 550);
	}
}
