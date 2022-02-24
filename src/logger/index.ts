/**
 *
 * Handles team-based logging to the browser console
 *
 * Prevents a proliferation of console.log in client-side
 * code.
 *
 * Subscribing to logs relies on LocalStorage
 */

import { storage } from '../storage';
import { teams } from './teams';

const KEY = 'gu.logger';

export type Styles = keyof typeof teams;
export type TeamName = Exclude<Styles, 'common'>;
type Teams<K extends string> = Record<K, Record<string, string>>;
const teamColours: Teams<Styles> = teams;

type LogCall = (team: TeamName, ...args: unknown[]) => void;
export type TeamSubscription = (arg: TeamName) => void;

const style = (team: Styles): string => {
	const { background, font } = teamColours[team];
	return `background: ${background}; color: ${font}; padding: 2px 3px; border-radius:3px`;
};

/**
 * Only logs in dev environments.
 */
export const debug: LogCall = (team, ...args) => {
	const isNotProd = window.location.origin !== 'https://www.theguardian.com';
	if (isNotProd) log(team, ...args);
};

/**
 * Runs in all environments, if local storage values are set.
 */
export const log: LogCall = (team, ...args) => {
	// TODO add check for localStorage

	if (!((storage.local.get(KEY) || '') as string).includes(team)) return;

	const styles = [style('common'), '', style(team), ''];

	console.log(`%c@guardian%c %c${team}%c`, ...styles, ...args);
};

/**
 * Subscribe to a team’s log
 * @param team the team’s unique ID
 */
const subscribeTo: TeamSubscription = (team) => {
	const teamSubscriptions: string[] = storage.local.get(KEY)
		? (storage.local.get(KEY) as string).split(',')
		: [];
	if (!teamSubscriptions.includes(team)) teamSubscriptions.push(team);
	storage.local.set(KEY, teamSubscriptions.join(','));
	log(team, '🔔 Subscribed, hello!');
};

/**
 * Unsubscribe to a team’s log
 * @param team the team’s unique ID
 */
const unsubscribeFrom: TeamSubscription = (team) => {
	log(team, '🔕 Unsubscribed, good-bye!');
	const teamSubscriptions: string[] = (storage.local.get(KEY) as string)
		.split(',')
		.filter((t) => t !== team);
	storage.local.set(KEY, teamSubscriptions.join(','));
};

/* istanbul ignore next */
if (typeof window !== 'undefined') {
	window.guardian ||= {};
	window.guardian.logger ||= {
		subscribeTo,
		unsubscribeFrom,
		teams: () => Object.keys(teamColours),
	};
}

export const _ = {
	teamColours,
	KEY,
};
