import fetch from 'node-fetch';
import { _, log } from './logger';
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

describe('Ensure labels are accessible', () => {
	type WebAIMContrastApiResponse = {
		ratio: string;
		AA: string;
		AALarge: string;
		AAA: string;
		AAALarge: string;
	};
	it.each(Object.entries(_.teamColours))(
		'should pass webaim API check for %s',
		(key, colour) => {
			const { font, background } = colour;
			const fcolor = font.replace('#', '');
			const bcolor = background.replace('#', '');
			const url = `https://webaim.org/resources/contrastchecker/?fcolor=${fcolor}&bcolor=${bcolor}&api`;

			return fetch(url)
				.then((response) => response.json())
				.then((data: WebAIMContrastApiResponse) => {
					if (data.AA) expect(data.AA).toBe('pass');
					else fail('data is malformed');
				})
				.catch((e) => {
					throw e;
				});
		},
	);
});
