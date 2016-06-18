import config from '../config';
import browserSync from 'browser-sync';
import gulp from 'gulp';

gulp.task('browserSync', () => {
	browserSync.init({
		port: config.browserPort,
		ui: {
			port: config.UIPort,
		},
		proxy: {
			target: 'http://127.0.0.1:7070',
		},
		notify: {
			styles: {
				top: 'auto',
				bottom: '0',
			},
		},
		ghostMode: false,
	});
});
