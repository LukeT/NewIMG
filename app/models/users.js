import config from '../../config.json';

export default class Users {
	constructor($http) {
		this._$http = $http;
	}

	changePassword(username, data) {
		return this._$http.post(`${config.urls.api}/users/${username}/password`, data)
			.then(resp => resp.data);
	}
}
