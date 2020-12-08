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

const teams = {
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
	cmp: {
		background: '#FF1493',
		font: '#333333',
	},
};

export type Styles = keyof typeof teams;
export type TeamName = Exclude<Styles, 'common'>;
type Teams<K extends string> = Record<K, Record<string, string>>;
const teamColours: Teams<Styles> = teams;

type LogCall = (team: TeamName, ...args: unknown[]) => void;
export type TeamFunction = (arg: TeamName) => void;

const style = (team: Styles): string => {
	const { background = 'black' } = { ...teamColours[team] };
	const { font = 'white' } = { ...teamColours[team] };
	return `background: ${background}; color: ${font}; padding: 2px; border-radius:3px`;
};

/**
 * Only logs in dev environments.
 */
export const debug: LogCall = (team, ...args) => {
	const isDevEnv =
		window.location.host.includes('localhost') ||
		window.location.host.endsWith('thegulocal.com') ||
		window.location.host.endsWith('.dev-theguardian.com');
	if (isDevEnv) log(team, ...args);
};

/**
 * Runs in all environments, if local storage values are set.
 */
export const log: LogCall = (team, ...args) => {
	// TODO add check for localStorage

	if (!((storage.local.get(KEY) || '') as string).includes(team)) return;

	const styles = [style('common'), '', style(team)];

	console.log(`%c@guardian%c %c${team}%c`, ...styles, ...args);
};

/**
 * Subscribe to a team’s log
 * @param team the team’s unique ID
 */
const subscribeTo: TeamFunction = (team: TeamName) => {
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
const unsubscribeFrom: TeamFunction = (team: TeamName) => {
	const teams: string[] = (storage.local.get(KEY) as string)
		.split(',')
		.filter((t) => t !== team);
	storage.local.set(KEY, teams.join(','));
};

const registeredTeams = (): string[] => {
	return Object.keys(teamColours);
};

if (typeof window !== 'undefined') {
	window.guardian ||= {};
	window.guardian.logger ||= {
		subscribeTo,
		unsubscribeFrom,
		registeredTeams,
	};
}

export const _ = {
	teamColours,
	KEY,
};
