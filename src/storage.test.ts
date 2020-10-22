import { storage } from './storage';

describe.each([
	['local', storage.local, global.localStorage],
	['session', storage.session, global.sessionStorage],
])('storage.%s', (title, implementation, native) => {
	let getSpy: jest.SpyInstance;
	let setSpy: jest.SpyInstance;

	beforeEach(() => {
		getSpy = jest.spyOn(native.__proto__, 'getItem');
		setSpy = jest.spyOn(native.__proto__, 'setItem');

		native.clear();
		implementation.__setAvailable(undefined);
	});

	afterEach(() => {
		getSpy.mockRestore();
		setSpy.mockRestore();
	});

	it(`sets availability if it isn't defined`, () => {
		expect(implementation.__getAvailable()).toBeUndefined();
		expect(implementation.isAvailable()).toBe(true);
	});

	it(`returns false for availability when there is an error`, () => {
		setSpy.mockImplementation(undefined);
		getSpy.mockImplementation(undefined);

		expect(implementation.__getAvailable()).toBeUndefined();
		expect(implementation.isAvailable()).toBe(false);
	});

	it(`returns cached availability when false`, () => {
		// Even if setItem works, it still returns false from cache
		implementation.__setAvailable(false);
		expect(implementation.isAvailable()).toBe(false);
	});

	it(`returns cached availability, even if broken`, () => {
		// Here setItem is explicitly broken but it still uses the cached true value
		implementation.__setAvailable(true);
		setSpy.mockImplementation(undefined);
		expect(implementation.isAvailable()).toBe(true);
	});

	it(`handles strings`, () => {
		const myString = 'a dog sat on a mat';
		implementation.set('aString', myString);

		expect(native.getItem('aString')).toBe(
			'{"value":"a dog sat on a mat"}',
		);

		expect(implementation.get('aString')).toEqual(myString);
	});

	it(`handles objects`, () => {
		const myObject = { foo: 'bar' };
		implementation.set('anObject', myObject);
		expect(native.getItem('anObject')).toBe('{"value":{"foo":"bar"}}');
		expect(implementation.get('anObject')).toEqual(myObject);
	});

	it(`handles arrays`, () => {
		const myArray = [true, 2, 'bar'];
		implementation.set('anArray', myArray);
		expect(native.getItem('anArray')).toBe('{"value":[true,2,"bar"]}');
		expect(implementation.get('anArray')).toEqual(myArray);
	});

	it(`handles booleans`, () => {
		implementation.set('iAmFalse', false);
		implementation.set('iAmTrue', true);
		expect(native.getItem('iAmFalse')).toBe('{"value":false}');
		expect(native.getItem('iAmTrue')).toBe('{"value":true}');
		expect(implementation.get('iAmFalse')).toEqual(false);
		expect(implementation.get('iAmTrue')).toEqual(true);
	});

	it(`handles empty strings`, () => {
		implementation.set('emptyString', '');
		expect(native.getItem('emptyString')).toBe('{"value":""}');
		expect(implementation.get('emptyString')).toEqual('');
	});

	it(`handles null`, () => {
		implementation.set('nullValue', null);
		expect(native.getItem('nullValue')).toBe('{"value":null}');
		expect(implementation.get('nullValue')).toEqual(null);
	});

	it(`handles empty key values`, () => {
		implementation.set('', 'I have no name');
		expect(native.getItem('')).toBe('{"value":"I have no name"}');
		expect(implementation.get('')).toEqual('I have no name');
	});

	it(`does not return an expired item`, () => {
		implementation.set('iAmExpired', 'data', new Date('1901-01-01'));
		expect(implementation.get('iAmExpired')).toBeNull();

		// check it's been deleted too
		expect(native.getItem('iAmExpired')).toBeNull();
	});

	it(`returns a non-expired item`, () => {
		implementation.set('iAmNotExpired', 'data', new Date('2040-01-01'));
		expect(implementation.get('iAmNotExpired')).toBeTruthy();
	});

	it(`deletes the entry`, () => {
		native.setItem('deleteMe', 'please delete me');
		expect(native.getItem('deleteMe')).toBeTruthy();

		implementation.remove('deleteMe');
		expect(native.getItem('deleteMe')).toBeNull();
	});
});
