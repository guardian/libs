import type { TeamFunction } from '../logger';

declare global {
	interface Window {
		// *************** START commercial.dcr.js hotfix ***************
		logger?: {
			addTeam: TeamFunction;
			removeTeam: TeamFunction;
		};
	}
}
