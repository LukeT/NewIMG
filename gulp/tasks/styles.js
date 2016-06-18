import config from '../config';
import gulp from 'gulp';
import sass from 'gulp-sass';
import handleErrors from '../util/handleErrors';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';

gulp.task('styles', () => gulp.src(config.styles.src)
		.pipe(sass({
			sourceComments: !global.isProd,
			outputStyle: global.isProd ? 'compressed' : 'nested',
			includePaths: config.styles.sassIncludePaths,
		}))
		.on('error', handleErrors)
		.pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
		.pipe(gulp.dest(config.styles.dest))
		.pipe(browserSync.stream())
);
