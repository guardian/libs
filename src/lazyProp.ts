/**
 * Lazily initialises a property on an object when the property is first accessed.
 * https://davidwalsh.name/lazy-object-initialization
 */

export type LazyProp = (
	hostObj: Record<string, unknown>,
	name: string,
	initialiser: () => unknown,
) => void;

export const lazyProp: LazyProp = (hostObj, name, initialiser) => {
	let defined = false;

	Object.defineProperty(hostObj, name, {
		get: function () {
			// If property has not been defined, we're going to do it now
			if (!defined) {
				// Define the property by assigning the return value of
				// the initialiser to the property
				Object.defineProperty(hostObj, name, {
					configurable: true,
					enumerable: true,
					value: initialiser.apply(hostObj),
					writable: true,
				});

				// don't do all this more than once
				defined = true;

				// return the value, since that's what we wanted in the first place
				return hostObj[name];
			}
		},
		configurable: true,
		enumerable: true,
	});
};
