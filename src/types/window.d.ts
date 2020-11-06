export type Switches = Record<string, boolean>;
export type Tests = Record<string, string>;

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
