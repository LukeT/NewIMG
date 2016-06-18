import config from '../../config.json';

export default class Auth {
	constructor($http) {
		this._$http = $http;
	}

	login(data) {
		return this._$http.post(`${config.urls.api}/auth/login`, data)
			.then(resp => resp.data);
	}

	signup(data) {
		return this._$http.post(`${config.urls.api}/auth/signup`, data)
			.then(resp => resp.data);
	}
}
