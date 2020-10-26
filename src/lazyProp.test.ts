import { lazyProp } from './lazyProp';

const setter = jest.fn(() => 'b');

describe('lazyProp', () => {
	it('allows you to use a property as normal', () => {
		const a: Record<string, unknown> = {};

		expect(a.b).toBeUndefined();
		expect(setter).toHaveBeenCalledTimes(0);

		lazyProp(a, 'b', setter);
		expect(setter).toHaveBeenCalledTimes(0);

		expect(a.b).toBe('b');
		expect(setter).toHaveBeenCalledTimes(1);

		expect(a.b).toBe('b');
		expect(a.b).toBe('b');
		expect(setter).toHaveBeenCalledTimes(1);

		a.b = 'B,B,B,B,B,B,B,B,B,B,B';
		expect(a.b).toBe('B,B,B,B,B,B,B,B,B,B,B');
		expect(setter).toHaveBeenCalledTimes(1);

		lazyProp(a, 'b', setter);
		expect(setter).toHaveBeenCalledTimes(1);

		expect(a.b).toBe('b');
		expect(a.b).toBe('b');
		expect(setter).toHaveBeenCalledTimes(2);

		delete a.b;
		expect(a.b).toBeUndefined();
		expect(setter).toHaveBeenCalledTimes(2);
	});
});
