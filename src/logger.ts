/**
 *
 * Handles team-based logging for developers in PROD
 *
 * Prevents a proliferation of console.log in client-side
 * code.
 *
 * Team registration relies on LocalStorage
 */

type TeamColors = Record<string, Record<string, string>>;

const teamColors: TeamColors = {
	common: {
		background: '#052962',
		font: 'white',
	},
	commercial: {
		background: 'mediumseagreen',
		font: 'darkgreen',
	},
};

const style = (team: string): string =>
	`background: ${teamColors[team].background}; color: ${teamColors[team].font}; padding: 2px; border-radius:3px`;

// Only runs in dev environments
export const debug = (team: string, ...args: unknown[]): void => {
	const isDevEnv = window.location.host.endsWith('.dev-theguardian.com');
	if (isDevEnv) log(team, ...args);
};

// Runs in all environments, if local storage values are set
export const log = (team: string, ...args: unknown[]): void => {
	// TODO add check for localStorage

	const styles = [style('common'), '', style(team)];

	console.log(`%c@guardian%c %c${team}%c`, ...styles, ...args);
};
