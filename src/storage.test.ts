import { storage } from './storage';

function functionThatThrowsAnError() {
	throw new Error('bang');
}

type StorageName = 'local' | 'session';
const LOCAL: StorageName = 'local';
const SESSION: StorageName = 'session';

describe.each([
	[LOCAL, storage[LOCAL], global.localStorage],
	[SESSION, storage[SESSION], global.sessionStorage],
])('storage.%s', (name, implementation, native) => {
	let getSpy: jest.SpyInstance;
	let setSpy: jest.SpyInstance;

	beforeEach(() => {
		getSpy = jest.spyOn(native.__proto__, 'getItem');
		setSpy = jest.spyOn(native.__proto__, 'setItem');
		jest.resetModules();
		native.clear();
	});

	afterEach(() => {
		getSpy.mockRestore();
		setSpy.mockRestore();
	});

	it(`detects native API availability`, async () => {
		expect(implementation.isAvailable()).toBe(true);

		setSpy.mockImplementation(functionThatThrowsAnError);
		getSpy.mockImplementation(functionThatThrowsAnError);

		// re-import now we've disabled native storage API
		const { storage } = await import('./storage');
		expect(storage[name].isAvailable()).toBe(false);
	});

	it(`is not available if getItem does not return what you setItem`, async () => {
		getSpy.mockImplementation(() => '🚫');

		// re-import now we've fiddled with the native storage API
		const { storage } = await import('./storage');
		expect(storage[name].isAvailable()).toBe(false);
	});

	it(`behaves nicely when storage is not available`, async () => {
		setSpy.mockImplementation(functionThatThrowsAnError);
		getSpy.mockImplementation(functionThatThrowsAnError);

		// re-import now we've disabled native storage API
		const { storage } = await import('./storage');
		expect(() => storage[name].set('🚫', true)).not.toThrowError();
		expect(() => storage[name].get('🚫')).not.toThrowError();
		expect(() => storage[name].remove('🚫')).not.toThrowError();
	});

	it(`stores and retrieves strings`, () => {
		const myString = 'a dog sat on a mat';
		implementation.set('aString', myString);

		expect(native.getItem('aString')).toBe(
			'{"value":"a dog sat on a mat"}',
		);

		expect(implementation.get('aString')).toEqual(myString);
	});

	it(`stores and retrieves objects`, () => {
		const myObject = { foo: 'bar' };
		implementation.set('anObject', myObject);
		expect(native.getItem('anObject')).toBe('{"value":{"foo":"bar"}}');
		expect(implementation.get('anObject')).toEqual(myObject);
	});

	it(`stores and retrieves arrays`, () => {
		const myArray = [true, 2, 'bar'];
		implementation.set('anArray', myArray);
		expect(native.getItem('anArray')).toBe('{"value":[true,2,"bar"]}');
		expect(implementation.get('anArray')).toEqual(myArray);
	});

	it(`stores and retrieves booleans`, () => {
		implementation.set('iAmFalse', false);
		implementation.set('iAmTrue', true);
		expect(native.getItem('iAmFalse')).toBe('{"value":false}');
		expect(native.getItem('iAmTrue')).toBe('{"value":true}');
		expect(implementation.get('iAmFalse')).toEqual(false);
		expect(implementation.get('iAmTrue')).toEqual(true);
	});

	it(`stores and retrieves empty strings`, () => {
		implementation.set('emptyString', '');
		expect(native.getItem('emptyString')).toBe('{"value":""}');
		expect(implementation.get('emptyString')).toEqual('');
	});

	it(`stores and retrieves null`, () => {
		implementation.set('nullValue', null);
		expect(native.getItem('nullValue')).toBe('{"value":null}');
		expect(implementation.get('nullValue')).toEqual(null);
	});

	it(`stores and retrieves empty key values`, () => {
		implementation.set('', 'I have no name');
		expect(native.getItem('')).toBe('{"value":"I have no name"}');
		expect(implementation.get('')).toEqual('I have no name');
	});

	it(`does not return a non-existing item`, () => {
		expect(implementation.get('thisDoesNotExist')).toBeNull();
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

	it(`deletes items`, () => {
		native.setItem('deleteMe', 'please delete me');
		expect(native.getItem('deleteMe')).toBeTruthy();

		implementation.remove('deleteMe');
		expect(native.getItem('deleteMe')).toBeNull();
	});
});
