export default function () {
	return (size) => {
		const sizes = ['Bytes', 'KB', 'MB'];
		let cSize = size;
		let resp;

		sizes.forEach(currentSize => {
			if (cSize < 1024 && !resp) {
				resp = `${cSize.toFixed(2)} ${currentSize}`;
			}

			cSize /= 1024;
		});

		return resp || cSize;
	};
}
