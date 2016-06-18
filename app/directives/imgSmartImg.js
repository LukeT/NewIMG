const blankImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAD6AQMAAAAho+iwAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAACBJREFUaN7twQENAAAAwiD7p7bHBwwAAAAAAAAAAICQAyYWAAF9F5dOAAAAAElFTkSuQmCC"; //eslint-disable-line

export default function ($interpolate) {
	return {
		restrict: 'A',
		compile(elem, attrs) {
			const $attrs = attrs;
			$attrs.imgSrc = $attrs.ngSrc;
			delete $attrs.ngSrc;

			return (scope, element, attr) => {
				const el = element[0];
				el.src = blankImage;

				const img = new Image();

				img.src = $interpolate(attr.imgSrc)(scope);
				img.onload = () => {
					if (el.src !== img.src) el.src = img.src;
					img.onload = null;
				};
			};
		},
	};
}
