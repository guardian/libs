import { log } from './logger';
import { storage } from './storage';

const KEY = 'gu.logger';

const spy = jest.spyOn(console, 'log');
const consoleMessage = (): string => {
	if (typeof spy.mock.calls[0][4] === 'string') return spy.mock.calls[0][4];
	return '';
};

describe('Logs messages', () => {
	const message = 'Hello, world!';

	it(`should log ${message}`, () => {
		log('common', message);
		expect(consoleMessage()).toBe(message);
	});

	it(`should only log common messages by default`, () => {
		log('fake', 'no');
		log('will-not-log', 'no');
		log('common', message);
		expect(consoleMessage()).toBe(message);
	});
});

describe('Team-based logging', () => {
	const teams = ['commercial', 'fake-team'];

	it.each(teams)(`should only log message for team: %s`, (team) => {
		storage.local.set(KEY, team);

		teams.map((t) => {
			log(t, `a message for ${t}`);
		});
		expect(consoleMessage()).toBe(`a message for ${team}`);
	});
});
