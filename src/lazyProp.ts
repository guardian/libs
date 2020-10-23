/**
 * Lazily initializes an object's property when it's first accessed.
 * https://davidwalsh.name/lazy-object-initialization
 */

export type LazyProp = (
	hostObj: Record<string, unknown>,
	name: string,
	initializer: () => unknown,
) => void;

export const lazyProp: LazyProp = (hostObj, name, initializer) => {
	let defined = false;

	Object.defineProperty(hostObj, name, {
		get: function () {
			// If not already defined, define it by executing
			// its initializer and setting it as value
			if (!defined) {
				defined = true;

				// Overrides the original property definition
				// which is the initializer
				Object.defineProperty(hostObj, name, {
					configurable: true,
					enumerable: true,
					value: initializer.apply(hostObj),
					writable: true,
				});

				return hostObj[name];
			}
		},
		configurable: true,
		enumerable: true,
	});
};
