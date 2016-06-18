import config from '../config';
import gulp from 'gulp';
import eslint from 'gulp-eslint';

gulp.task('eslint', () => gulp.src([config.scripts.src, '!app/templates.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
);
