/**
 * Lazily initialises a property on an object when the property is first accessed.
 * Based on https://davidwalsh.name/lazy-object-initialization
 */

export type LazyProp = (
	object: Record<string, unknown>,
	name: string,
	initialiser: () => unknown,
) => void;

export const lazyProp: LazyProp = (object, name, initialiser) => {
	Object.defineProperty(object, name, {
		configurable: true,
		enumerable: true,
		get: function () {
			const value = initialiser.apply(this);
			Object.defineProperty(this, name, {
				configurable: true,
				enumerable: true,
				writable: true,
				value,
			});
			return value;
		},
	});
};
