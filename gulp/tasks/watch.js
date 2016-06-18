import config from '../config';
import gulp from 'gulp';

gulp.task('watch', ['browserSync'], () => {
	global.isWatching = true;

	gulp.watch(config.scripts.src, ['eslint']);
	gulp.watch(config.styles.src, ['styles']);
	gulp.watch(config.images.src, ['images']);
	gulp.watch(config.fonts.src, ['fonts']);
	gulp.watch(config.views.watch, ['views']);
});
