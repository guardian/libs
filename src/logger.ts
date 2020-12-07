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

// Only runs in dev environments
export const debug = (team: string, ...args: unknown[]): void => {
	const isDevEnv = window.location.host.endsWith('.dev-theguardian.com');
	if (isDevEnv) log(team, ...args);
};

// Runs in all environments, if local storage values are set
export const log = (team: string, ...args: unknown[]): void => {
	// TODO add check for localStorage

	const registeredTeams = new String(storage.local.get(KEY)).split(',');

	if (team !== 'common' && !registeredTeams.includes(team)) return;

	const styles = [style('common'), '', style(team)];

	console.log(`%c@guardian%c %c${team}%c`, ...styles, ...args);
};

export const _ = {
	teamColours,
	KEY,
};
