import { log } from './logger';

console.log = jest.fn();

describe('Logs messages', () => {
	const message = 'Hello, world!';

	it(`should log ${message}`, () => {
		log('common', message);
		expect(console.log.mock.calls[0][4]).toBe(message);
	});
});
