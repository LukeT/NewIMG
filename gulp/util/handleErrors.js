import notify from 'gulp-notify';

function handleError(error) {
	if (!global.isProd) {
		const args = Array.prototype.slice.call(arguments);

		// Send error to notification center with gulp-notify
		notify.onError({
			title: 'Compile Error',
			message: '<%= error.message %>',
		}).apply(this, args);

		// Keep gulp from hanging on this task
		this.emit('end');
	} else {
		// Log the error and stop the process
		// to prevent broken code from building
		console.log(error); //eslint-disable-line
		process.exit(1);
	}
}

export default handleError;
