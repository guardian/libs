import { lazyProp } from './lazyProp';

const a: Record<string, unknown> = {};

describe('lazyProp', () => {
	it('allows you to use a property as normal', () => {
		expect(a.b).toBeUndefined();

		lazyProp(a, 'b', () => 'b');
		expect(a.b).toBe('b');

		a.b = 'B,B,B,B,B,B,B,B,B,B,B';
		expect(a.b).toBe('B,B,B,B,B,B,B,B,B,B,B');

		lazyProp(a, 'b', () => 'b');
		expect(a.b).toBe('b');

		delete a.b;
		expect(a.b).toBeUndefined();
	});
});
