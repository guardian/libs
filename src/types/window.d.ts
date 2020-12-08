import type { TeamFunction } from '../logger';

declare global {
	interface Window {
		// *************** START commercial.dcr.js hotfix ***************
		logger?: {
			subscribeTo: TeamFunction;
			unsubscribeFrom: TeamFunction;
		};
	}
}
