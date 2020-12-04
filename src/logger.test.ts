import { log } from './logger';

const spy = jest.spyOn(console, 'log');

describe('Logs messages', () => {
	const message = 'Hello, world!';

	it(`should log ${message}`, () => {
		log('common', message);
		expect(spy.mock.calls[0][4]).toBe(message);
	});
});
