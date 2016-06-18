import config from '../config';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import gutil from 'gulp-util';
import source from 'vinyl-source-stream';
import streamify from 'gulp-streamify';
import watchify from 'watchify';
import browserify from 'browserify';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import handleErrors from '../util/handleErrors';
import browserSync from 'browser-sync';
import debowerify from 'debowerify';
import ngAnnotate from 'browserify-ngannotate';

function buildScript(file) {
	let bundler = browserify({
		entries: [config.sourceDir + file],
		cache: {},
		packageCache: {},
		fullPaths: !global.isProd,
	});

	function rebundle() {
		const stream = bundler.bundle();

		return stream.on('error', handleErrors)
		.pipe(source(file))
		.pipe(gulpif(global.isProd, streamify(uglify({
			compress: { drop_console: true }, // eslint-disable-line camelcase
		}))))
		.pipe(gulp.dest(config.scripts.dest))
		.pipe(browserSync.stream());
	}

	if (!global.isProd) {
		bundler = watchify(bundler);

		bundler.on('update', () => {
			rebundle();
			gutil.log('Rebundle...');
		});
	}

	const transforms = [
		{ name: babelify, options: {} },
		{ name: debowerify, options: {} },
		{ name: ngAnnotate, options: {} },
		{ name: 'brfs', options: {} },
		{ name: 'bulkify', options: {} },
	];

	transforms.forEach((transform) => {
		bundler.transform(transform.name, transform.options);
	});

	return rebundle();
}

gulp.task('browserify', () => buildScript('app.js'));
