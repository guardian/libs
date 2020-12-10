import fetch from 'node-fetch';
import type { TeamName } from './logger';
import { _, debug, log } from './logger';
import { storage } from './storage';

const KEY = _.KEY;

const spy = jest.spyOn(console, 'log');
const consoleMessage = (): string | undefined => {
	if (spy.mock.calls[0] && typeof spy.mock.calls[0][5] === 'string')
		return spy.mock.calls[0][5];
	return undefined;
};

describe('Logs messages for a team', () => {
	it(`should not log any messages by default`, () => {
		log('cmp', 'this will not log');
		log('commercial', 'neither will this');
		log('dotcom', 'or this');
		expect(consoleMessage()).toBeUndefined();
	});

	const message = 'Hello, world!';
	const team = 'cmp';

	it(`should be able to add team ${team}`, () => {
		if (window.guardian?.logger) window.guardian.logger.subscribeTo(team);
		const registered: string = storage.local.get(KEY) as string;
		expect(registered).toBe(team);
	});
	it(`should log ${message} for team ${team}`, () => {
		log(team, message);
		expect(consoleMessage()).toBe(message);
	});

	it('should log debug messages in dev', () => {
		debug(team, message);
		expect(consoleMessage()).toBe(message);
	});

	it('should not log debug messages in prod', () => {
		//@ts-expect-error -- we’re modifying the window
		delete window.location;
		//@ts-expect-error -- we only check window.location.host
		window.location = new URL('https://www.theguardian.com');

		debug(team, message);
		expect(consoleMessage()).toBe(undefined);
	});
});

describe('Add and remove teams', () => {
	it(`should first clear local storage`, () => {
		storage.local.clear();
		expect(storage.local.get(KEY)).toBe(null);
	});
	it(`should be able to add two teams`, () => {
		if (window.guardian?.logger) {
			window.guardian.logger.subscribeTo('commercial');
			window.guardian.logger.subscribeTo('dotcom');
		}
		const registered: string = storage.local.get(KEY) as string;
		expect(registered).toBe('commercial,dotcom');
	});

	it(`should be able to add a third team`, () => {
		if (window.guardian?.logger) window.guardian.logger.subscribeTo('cmp');
		const registered: string = storage.local.get(KEY) as string;
		expect(registered).toBe('commercial,dotcom,cmp');
	});

	it(`should be able to remove a third team`, () => {
		if (window.guardian?.logger)
			window.guardian.logger.unsubscribeFrom('cmp');
		const registered: string = storage.local.get(KEY) as string;
		expect(registered).toBe('commercial,dotcom');
	});

	it(`should be able to remove a team`, () => {
		if (window.guardian?.logger)
			window.guardian.logger.unsubscribeFrom('commercial');
		const registered: string = storage.local.get(KEY) as string;
		expect(registered).toBe('dotcom');
	});

	it('should return the list of registered teams', () => {
		let teams: string[] = [];
		if (window.guardian?.logger) teams = window.guardian.logger.teams();
		console.log(teams);
		expect(Array.isArray(teams)).toBe(true);
		expect(teams).toContain('cmp');
	});
});

describe('Team-based logging', () => {
	const teams: TeamName[] = ['cmp', 'commercial', 'dotcom'];

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
		'should have a minimum contrast ratio of 4.5 (AA) for %s',
		(key, colour) => {
			const { font, background } = colour;
			const fcolor = font.replace('#', '');
			const bcolor = background.replace('#', '');
			const url = `https://webaim.org/resources/contrastchecker/?fcolor=${fcolor}&bcolor=${bcolor}&api`;

			return fetch(url)
				.then((response) => response.json())
				.then((data: WebAIMContrastApiResponse) => {
					const ratio = Number.parseFloat(data.ratio);
					expect(ratio).toBeGreaterThanOrEqual(4.5);
				})
				.catch((e) => {
					throw e;
				});
		},
	);
});
