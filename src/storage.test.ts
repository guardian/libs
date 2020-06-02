import { storage } from './storage';

const testStorage = (
	storageName: 'localStorage' | 'sessionStorage',
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fn: any,
) => {
	const engine = fn(storageName);

	beforeEach(() => {
		engine.available = true;
	});

	afterEach(() => {
		engine.storage.clear();
	});

	it(`${storageName} - sets availability if it isn't defined`, () => {
		engine.available = undefined;
		expect(engine.isAvailable()).toBe(true);
		expect(engine.available).toBe(true);
	});

	it(`${storageName} - returns false for availability when there is an error`, () => {
		const origStorage = engine.storage;

		// not available, if setItem fails
		engine.available = undefined;
		engine.storage = {
			setItem() {
				throw new Error('Problem!');
			},
		};
		expect(engine.isAvailable()).toBe(false);

		engine.storage = origStorage;
	});

	it(`${storageName} - returns cached availability when false`, () => {
		// Even if setItem works, it still returns false from cache
		engine.available = false;
		expect(engine.isAvailable()).toBe(false);
	});

	it(`${storageName} - returns cached availability, even if broken`, () => {
		const origStorage = engine.storage;

		// Here setItem is explictly broken but it still uses the cached true value
		engine.available = true;
		engine.storage = {
			setItem() {
				throw new Error('Problem!');
			},
		};
		expect(engine.isAvailable()).toBe(true);

		engine.storage = origStorage;
	});

	it(`${storageName} - handles strings`, () => {
		const myString = 'a dog sat on a mat';
		engine.set('aString', myString);
		expect(engine.storage.getItem('aString')).toBe(
			'{"value":"a dog sat on a mat"}',
		);
		expect(engine.get('aString')).toEqual(myString);
	});

	it(`${storageName} - handles objects`, () => {
		const myObject = { foo: 'bar' };
		engine.set('anObject', myObject);
		expect(engine.storage.getItem('anObject')).toBe(
			'{"value":{"foo":"bar"}}',
		);
		expect(engine.get('anObject')).toEqual(myObject);
	});

	it(`${storageName} - handles arrays`, () => {
		const myArray = [true, 2, 'bar'];
		engine.set('anArray', myArray);
		expect(engine.storage.getItem('anArray')).toBe(
			'{"value":[true,2,"bar"]}',
		);
		expect(engine.get('anArray')).toEqual(myArray);
	});

	it(`${storageName} - handles booleans`, () => {
		engine.set('iAmFalse', false);
		engine.set('iAmTrue', true);
		expect(engine.storage.getItem('iAmFalse')).toBe('{"value":false}');
		expect(engine.storage.getItem('iAmTrue')).toBe('{"value":true}');
		expect(engine.get('iAmFalse')).toEqual(false);
		expect(engine.get('iAmTrue')).toEqual(true);
	});

	it(`${storageName} - handles empty strings`, () => {
		engine.set('emptyString', '');
		expect(engine.storage.getItem('emptyString')).toBe('{"value":""}');
		expect(engine.get('emptyString')).toEqual('');
	});

	it(`${storageName} - handles null`, () => {
		engine.set('nullValue', null);
		expect(engine.storage.getItem('nullValue')).toBe('{"value":null}');
		expect(engine.get('nullValue')).toEqual(null);
	});

	it(`${storageName} - handles empty key values`, () => {
		engine.set('', 'I have no name');
		expect(engine.storage.getItem('')).toBe('{"value":"I have no name"}');
		expect(engine.get('')).toEqual('I have no name');
	});

	it(`${storageName} - handles numbers as key names`, () => {
		engine.set(6, 'I am six');
		expect(engine.storage.getItem(6)).toBe('{"value":"I am six"}');
		expect(engine.get(6)).toEqual('I am six');
	});

	it(`${storageName} - get() with expired item`, () => {
		engine.set('iAmExpired', 'data', new Date('1901-01-01'));
		expect(engine.get('iAmExpired')).toBeNull();
	});

	it(`${storageName} - get() with non-expired item`, () => {
		engine.set('iAmNotExpired', 'data', new Date('2040-01-01'));
		expect(engine.get('iAmNotExpired')).toBeTruthy();
	});

	it(`${storageName} - getRaw() returns the unparsed string`, () => {
		const myString = 'a dog sat on a mat';
		// storage.setItem just sets the string
		engine.storage.setItem('aString', myString);
		expect(engine.getRaw('aString')).toBe(myString);
		// engine.set is our function which sets the string inside an object
		engine.set('setAsValue', myString);
		expect(engine.getRaw('setAsValue')).toBe(
			'{"value":"a dog sat on a mat"}',
		);
	});

	it(`${storageName} - remove() deletes the entry`, () => {
		engine.storage.setItem('deleteMe', 'please delete me');
		expect(engine.storage.getItem('deleteMe')).toBeTruthy();
		engine.remove('deleteMe');
		expect(engine.storage.getItem('deleteMe')).toBeFalsy();
	});
};

describe('sessionStorage', () => {
	testStorage('sessionStorage', storage.session);
});

describe('localStorage', () => {
	testStorage('localStorage', storage.local);
});
