import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('dev-app', ['clean'], (cb) => {
	global.isProd = false;
	runSequence(
		['images', 'fonts', 'fontbuilder', 'views'],
		['styles', 'browserify'],
		'watch',
		cb
	);
});
