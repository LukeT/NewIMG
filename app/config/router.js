export default ($stateProvider, $locationProvider, $urlRouterProvider) => {
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('auth', {
			url: '/auth',
			abstract: true,
			templateUrl: 'auth/base.html',
		})
		.state('auth.signup', {
			url: '/signup',
			title: 'Sign Up',
			data: {
				noAuth: true,
			},
			views: {
				'app:auth': {
					templateUrl: 'auth/signup.html',
					controller: 'SignupCtrl',
					controllerAs: 'vm',
				},
			},
		})
		.state('auth.login', {
			url: '/login',
			title: 'Log In',
			data: {
				noAuth: true,
			},
			views: {
				'app:auth': {
					templateUrl: 'auth/login.html',
					controller: 'LoginCtrl',
					controllerAs: 'vm',
				},
			},
		})

		.state('logout', {
			url: '/auth/logout',
			controller: (currentUser, $state) => {
				currentUser.logout();
				$state.go('auth.login');
			},
		})


		.state('app', {
			abstract: true,
			templateUrl: 'app/base.html',
			controller: 'NavCtrl',
			controllerAs: 'vm',
		})

		.state('app.uploads', {
			url: '/uploads',
			title: 'Uploads',
			views: {
				'app:dashboard': {
					templateUrl: 'app/uploads.html',
					controller: 'UploadsCtrl',
					controllerAs: 'vm',
				},
			},
		})

		.state('app.folders', {
			url: '/folders',
			title: 'Folders',
			views: {
				'app:dashboard': {
					templateUrl: 'app/folders.html',
					controller: 'FoldersCtrl',
					controllerAs: 'vm',
				},
			},
		})

		.state('app.account', {
			url: '/account',
			title: 'Account',
			abstract: true,
			views: {
				'app:dashboard': {
					templateUrl: 'app/account.html',
				},
			},
		});

	$urlRouterProvider.otherwise(($injector) => $injector.get('$state').go('app.uploads'));
};
