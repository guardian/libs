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
	commercial: {
		background: 'mediumseagreen',
		font: 'darkgreen',
	},
};

export const logger = (team: string, ...args: unknown[]): void => {
	// TODO add check for localStorage

	console.log(
		`%c@guardian%c %c${team}%c`,
		'background: #052962; color: white; padding: 2px; border-radius:3px',
		'',
		`background: ${teamColors[team].background}; color: ${teamColors[team].font}; padding: 2px; border-radius:3px`,
		args,
	);
};
