export default class LoginCtrl {
	_initialize($state, currentUser, AuthModel) {
		this._state = $state;
		this._currentUser = currentUser;
		this._auth = AuthModel;
	}

	/* @ngInject */
	constructor($state, currentUser, AuthModel) {
		this._initialize($state, currentUser, AuthModel);

		if (this._currentUser.loggedIn()) {
			$state.go('app.uploads');
		}
	}

	login() {
		this._auth.login({
			username: this.loginForm.username,
			password: this.loginForm.password,
		}).then(jwt => {
			this._currentUser.set(jwt.user);
			this._currentUser.session(jwt.token);
			this._state.go('app.uploads');
		});
	}
}
