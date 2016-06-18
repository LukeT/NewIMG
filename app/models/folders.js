import config from '../../config.json';

export default class Folders {
	constructor($http) {
		this._$http = $http;
	}

	all(from, count) {
		return this._$http.get(`${config.urls.api}/folders`)
			.then(resp => resp.data);
	}

	getImages(folder) {
		return this._$http.get(`${config.urls.api}/folders/${folder}/images`)
			.then(resp => resp.data);
	}


	insert(data) {
		return this._$http.post(`${config.urls.api}/folders`, data)
			.then(resp => resp.data);
	}

	update(slug, data) {
		return this._$http.patch(`${config.urls.api}/folders/${slug}`, data)
			.then(resp => resp.data);
	}


	delete(folder) {
		return this._$http.delete(`${config.urls.api}/folders/${folder}`)
			.then(resp => resp.data);
	}
}
