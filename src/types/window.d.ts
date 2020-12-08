import type { TeamFunction } from '../logger';

declare global {
	interface Window {
		guardian?: {
			logger?: {
				subscribeTo: TeamFunction;
				unsubscribeFrom: TeamFunction;
				registeredTeams: () => string[];
			};
		};
	}
}
