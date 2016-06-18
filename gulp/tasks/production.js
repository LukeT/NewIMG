import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('prod', ['clean'], (cb = () => {}) => {
	global.isProd = true;
	runSequence(['images', 'fonts', 'fontbuilder', 'views', 'config'], ['styles', 'browserify'], cb);
});
