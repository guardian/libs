import type { TeamSubscription } from '../logger/@types/logger';
import type { Switches } from '../switches/@types/Switches';
import type { Collector } from '../tracker/@types/tracker';

declare global {
	interface Window {
		guardian?: {
			logger?: {
				subscribeTo: TeamSubscription;
				unsubscribeFrom: TeamSubscription;
				teams: () => string[];
			};
			tracking?: {
				collectors: Record<string, Collector | undefined>;
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
