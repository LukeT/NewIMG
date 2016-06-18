import angular from 'angular';

export default class currentUser {

	_initialize(localStorageService, md5, $http) {
		this._http = $http;
		this._md5 = md5;
		this._localStorage = localStorageService;
	}

	constructor(localStorageService, md5, $http) {
		this._initialize(localStorageService, md5, $http);
	}

	/**
	 * Set the user model.
	 *
	 * @method set
	 * @param  {Object} data The current user model.
	 */
	set(data) {
		this.model = data;
	}

	/**
	 * Get the user model.
	 *
	 * @method get
	 * @return {Object} The current user model.
	 */
	get() {
		return this.model;
	}

	/**
	 * Set the authentication header.
	 *
	 * @method _setHeader
	 * @param  {String}   jwt JWT Session Token.
	 */
	_setHeader(jwt) {
		if (!jwt) return;
		angular.extend(this._http.defaults.headers.common, { Authorization: `Bearer ${jwt}` });
	}

	/**
	 * Authenticate the user.
	 *
	 * @method session
	 * @param  {String} sessionToken JWT Session Token
	 */
	session(sessionToken) {
		this._localStorage.set('jwt', sessionToken);
		this._setHeader(this._localStorage.get('jwt'));
	}

	/**
	 * Refresh the session from local storage
	 *
	 * @method revalidate
	 */
	revalidate() {
		this._setHeader(this._localStorage.get('jwt'));
	}


	/**
	 * Check whether the user is logged in.
	 *
	 * @method loggedIn
	 * @return {Boolean} Authentication State.
	 */
	loggedIn() {
		return !!this.model;
	}

	/**
	 * Log the user out.
	 *
	 * @method logout
	 */
	logout() {
		this.model = null;
		this._localStorage.remove('jwt');
		angular.extend(this._http.defaults.headers.common, { Authorization: false });
	}

	/**
	 * Fetch the users avatar.
	 *
	 * @method getAvatar
	 * @return {String}  A URL to the users avatar.
	 */
	getAvatar() {
		if (!this.model) return '';
		if (this.model.avatar) return this.model.avatar;
		return `https://www.gravatar.com/avatar/${this._md5.createHash(this.model.email)}`;
	}
}
