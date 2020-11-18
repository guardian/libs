import type { Switches } from './switches';
import type { Tests } from './tests';

declare global {
	interface Window {
		guardian?: {
			config?: {
				switches?: Switches;
				tests?: Tests;
				[key: string]: unknown;
			};
		};
	}
}
