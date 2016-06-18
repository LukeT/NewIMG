import config from '../config';
import gulp from 'gulp';
import iconfont from 'gulp-iconfont';
import consolidate from 'gulp-consolidate';

gulp.task('fontbuilder', () => gulp.src(config.svg.src)
	.pipe(iconfont({ fontName: config.svg.name, normalize: true }))
	.on('glyphs', (glyphs) => {
		gulp.src('app/scss/base/_fontTemplate.scss')
			.pipe(consolidate('lodash', {
				glyphs,
				fontName: config.svg.name,
				fontPath: config.svg.dest,
				className: config.svg.name,
			})).pipe(gulp.dest('app/scss/fonts'));
	})
	.pipe(gulp.dest(config.svg.dest))
);
