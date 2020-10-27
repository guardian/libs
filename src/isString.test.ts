import { isString } from './isString';

describe('isString', () => {
	it('detects a valid string', () => {
		expect(isString('hello')).toBe(true);
		expect(isString(new String())).toBe(true);
	});

	it('detects an invalid string', () => {
		expect(isString(null)).toBe(false);
		expect(isString(undefined)).toBe(false);
		expect(isString(true)).toBe(false);
		expect(isString(123)).toBe(false);
		expect(isString(Symbol('Sym'))).toBe(false);
		expect(isString(new Object())).toBe(false);
		expect(isString([])).toBe(false);
		expect(isString(new Map())).toBe(false);
		expect(isString(new Set())).toBe(false);
		expect(isString(new WeakMap())).toBe(false);
		expect(isString(new WeakSet())).toBe(false);
		expect(isString(new Date())).toBe(false);
		expect(
			isString(function () {
				return null;
			}),
		).toBe(false);
	});
});
