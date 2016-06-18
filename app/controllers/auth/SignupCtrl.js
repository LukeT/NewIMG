export default class SignupCtrl {
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

	signup() {
		const form = this.signupForm;

		this._auth.signup(form)
			.then(() => {
				this._auth.login({
					username: this.signupForm.username,
					password: this.signupForm.password,
				}).then(jwt => {
					this._currentUser.set(jwt.user);
					this._currentUser.session(jwt.token);
					this._state.go('app.uploads');
				});
			})
			.catch(error => {
				if (error.data.message === 'username in use') {
					this.signupError = 'The username you\'ve requested is already in use.';
				} else if (error.data.message === 'email in use') {
					this.signupError = 'The email you\'ve requested is already in use.';
				}
			});
	}
}
