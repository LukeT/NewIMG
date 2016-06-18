export default {

	browserPort: 3000,
	UIPort: 3001,

	sourceDir: './app/',
	buildDir: './build_app/',

	styles: {
		src: ['app/scss/**/*.scss', '!app/scss/vendor/**/**/**/*.scss'],
		dest: 'build_app/css',
		prodSourcemap: true,
		sassIncludePaths: [],
	},

	scripts: {
		src: 'app/**/**/*.js',
		dest: 'build_app/js',
	},

	images: {
		src: 'app/resources/images/**/*',
		dest: 'build_app/images',
	},

	fonts: {
		src: ['app/resources/fonts/**/*'],
		dest: 'build_app/fonts',
	},

	svg: {
		src: ['app/svgs/*.svg'],
		dest: 'build_app/fonts',
		name: 'icon',
	},

	assetExtensions: [
		'js',
		'css',
		'png',
		'jpe?g',
		'gif',
		'svg',
		'eot',
		'otf',
		'ttc',
		'ttf',
		'woff2?',
	],

	views: {
		index: 'app/index.html',
		src: 'app/views/**/**/*.html',
		dest: 'app',
	},

	gzip: {
		src: 'build_app/**/*.{html,xml,json,css,js,js.map,css.map}',
		dest: 'build_app/',
		options: {},
	},

	browserify: {
		bundleName: 'app.js',
		prodSourcemap: true,
	},

	init() {
		this.views.watch = [
			this.views.index,
			this.views.src,
		];

		return this;
	},
}.init();
