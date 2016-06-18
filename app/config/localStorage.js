/* @ngInject */
function localstorage(localStorageServiceProvider) {
	localStorageServiceProvider
		.setPrefix('newimg')
		.setStorageCookie(7);
}

export default localstorage;
