import angular from 'angular';

export default class NewImgCtrl {

	_initialize($state, $scope, $timeout, currentUser, AppModel) {
		this._state = $state;
		this._scope = $scope;
		this._timeout = $timeout;
		this._appModel = AppModel;
		this.currentUser = currentUser;

		this.running = false;
	}

	/* @ngInject */
	constructor($state, $scope, $timeout, currentUser, AppModel) {
		this._initialize($state, $scope, $timeout, currentUser, AppModel);
		this.currentUser.revalidate();

		this._go();
		this._scope.$on('$stateChangeStart', this._stateChangeStart.bind(this));
	}

	_stateChangeStart(event, toState, toParams, fromState, fromParams) {
		const params = fromParams;

		if (fromParams.booted) {
			if (!this.currentUser.loggedIn()) {
				if (toState.data && toState.data.noAuth) return;
				event.preventDefault();
				this._state.go('auth.login');
			}
		} else {
			event.preventDefault();

			this._hasBooted(() => {
				params.booted = true;
				this._state.go(toState.name, angular.copy(toParams));
			});
		}
	}

	_hasBooted(cb) {
		if (this.running) return cb();
		return this._timeout(() => this._hasBooted(cb), 1000);
	}

	/**
	 * Try and fetch the data from the core endpoint
	 * which has necessary information for operation, loop
	 * until we have that data.
	 *
	 * @method _go
	 */
	_go() {
		this._appModel.get()
			.then(data => {
				this.running = true;
				if (data.authenticated) this.currentUser.set(data.user);
			}).catch(() => {
				this._timeout(() => {
					this._go();
				}, 1000);
			});
	}
}
