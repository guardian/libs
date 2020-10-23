import { lazyProp } from './lazyProp';

const a: Record<string, unknown> = {};

describe('loadScript', () => {
	it('sets a property', () => {
		expect(a.b).toBeUndefined();

		lazyProp(a, 'b', () => 'b');
		expect(a.b).toBe('b');

		a.b = 'B,B,B,B,B,B,B,B,B,B,B';
		expect(a.b).toBe('B,B,B,B,B,B,B,B,B,B,B');
	});
});
