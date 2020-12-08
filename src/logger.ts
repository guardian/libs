/**
 *
 * Handles team-based logging for developers in PROD
 *
 * Prevents a proliferation of console.log in client-side
 * code.
 *
 * Team registration relies on LocalStorage
 */

import { storage } from './storage';

const KEY = 'gu.logger';

type TeamColours = Record<string, Record<string, string>>;
export type TeamFunction = (arg: string) => void;

const teamColours: TeamColours = {
	common: {
		background: '#052962',
		font: '#ffffff',
	},
	commercial: {
		background: '#77EEAA',
		font: '#004400',
	},
	dotcom: {
		background: '#000000',
		font: '#ff7300',
	},
};

const style = (team: string): string => {
	const { background = 'black' } = { ...teamColours[team] };
	const { font = 'white' } = { ...teamColours[team] };
	return `background: ${background}; color: ${font}; padding: 2px; border-radius:3px`;
};

/**
 * Only logs in dev environments.
 */
export const debug = (team: string, ...args: unknown[]): void => {
	const isDevEnv =
		window.location.host.includes('localhost') ||
		window.location.host.endsWith('.dev-theguardian.com');
	if (isDevEnv) log(team, ...args);
};

/**
 * Runs in all environments, if local storage values are set.
 */
export const log = (team: string, ...args: unknown[]): void => {
	// TODO add check for localStorage

	if (!((storage.local.get(KEY) || '') as string).includes(team)) return;

	const styles = [style('common'), '', style(team)];

	console.log(`%c@guardian%c %c${team}%c`, ...styles, ...args);
};

/**
 * Subscribe to a team’s log
 * @param team the team’s unique ID
 */
const subscribeTo: TeamFunction = (team) => {
	const teams: string[] = storage.local.get(KEY)
		? (storage.local.get(KEY) as string).split(',')
		: [];
	teams.push(team);
	storage.local.set(KEY, teams.join(','));
};

/**
 * Unsubscribe to a team’s log
 * @param team the team’s unique ID
 */
const unsubscribeFrom: TeamFunction = (team) => {
	const teams: string[] = (storage.local.get(KEY) as string)
		.split(',')
		.filter((t) => t !== team);
	storage.local.set(KEY, teams.join(','));
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- we only register subscription if window is available
if (window) {
	window.guardian ||= {};
	window.guardian.logger = {
		subscribeTo,
		unsubscribeFrom,
	};
}

export const _ = {
	teamColours,
	KEY,
};
