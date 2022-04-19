import { isEnum } from './isEnum';

describe('isEnum', () => {
	it('detects an enum-like object', () => {
		expect(isEnum({ a: 1, b: 2, c: 3 })).toBe(true);
		expect(isEnum({ 1: 'a', 2: 'b', 3: 'c' })).toBe(true);
	});

	it('fails for an empty object', () => {
		expect(isEnum({})).toBe(false);
	});

	it('fails for an object with overlapping values', () => {
		expect(isEnum({ a: 0, b: 0, c: 0 })).toBe(false);
		expect(isEnum({ 0: 'a', 1: 'a', 2: 'a' })).toBe(false);
	});
});
