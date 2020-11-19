import type { Switches } from './switches';

declare global {
	interface Window {
		guardian?: {
			config?: {
				switches?: Switches;
				[key: string]: unknown;
			};
		};
	}
}
