import config from '../../config.json';

export default class App {
	constructor($http) {
		this._$http = $http;
	}

	get() {
		return this._$http.get(`${config.urls.api}/app`)
			.then(resp => resp.data);
	}
}
