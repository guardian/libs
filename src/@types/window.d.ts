import type { TeamSubscription } from '../logger';
import type { Switches } from './switches';

declare global {
	interface Window {
		guardian?: {
			logger?: {
				subscribeTo: TeamSubscription;
				unsubscribeFrom: TeamSubscription;
				teams: () => string[];
			};
			config?: {
				page?: {
					isPreview: boolean;
				};
				switches?: Switches;
			};
		};
	}
}
