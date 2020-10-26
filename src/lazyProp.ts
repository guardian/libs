/**
 * Lazily initialises a property on an object when the property is first accessed.
 * Based on https://davidwalsh.name/lazy-object-initialization
 *
 * ```
 * const x = { a: 'a' };
 * lazyProp(x, 'b', anExpensiveCalculation) // x.b is undefined until it's accessed, like a cat in a box
 * alert(x.b) // anExpensiveCalculation runs and x.b assumes the value it returns
 * ```
 */

export type LazyProp = (
	object: Record<string, unknown>,
	name: string,
	getValue: () => unknown,
) => void;

export const lazyProp: LazyProp = (object, name, getValue) => {
	Object.defineProperty(object, name, {
		configurable: true,
		enumerable: true,
		get: function () {
			const value = getValue.apply(this);
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
