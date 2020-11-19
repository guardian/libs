import type { Experiments } from './experiments';
import type { Switches } from './switches';

declare global {
	interface Window {
		guardian?: {
			config?: {
				switches?: Switches;
				experiments?: Experiments;
				[key: string]: unknown;
			};
		};
	}
}
