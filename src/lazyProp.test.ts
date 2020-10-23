import { lazyProp } from './lazyProp';

const x: Record<string, unknown> = {};

describe('loadScript', () => {
	it('sets a property', () => {
		expect(x.p).toBeUndefined();
		lazyProp(x, 'p', () => 'hi');
		expect(x.p).toBe('hi');
	});
});
