import config from '../../config.json';

export default class Images {
	constructor($http) {
		this._$http = $http;
	}

	get(from, count) {
		return this._$http.get(`${config.urls.api}/images`)
			.then(resp => resp.data);
	}

	update(slug, data) {
		return this._$http.patch(`${config.urls.api}/images/${slug}`, data)
			.then(resp => resp.data);
	}

	delete(slug) {
		return this._$http.delete(`${config.urls.api}/images/${slug}`)
			.then(resp => resp.data);
	}
}
