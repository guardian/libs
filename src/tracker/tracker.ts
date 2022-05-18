import type { Collector, Track } from './@types/tracker';

/** List of collecting functions to run at page unload */
const collectors: Record<string, Collector | undefined> =
	window.guardian?.tracking?.collectors ?? {};

if (typeof window !== 'undefined' && !window.guardian?.tracking?.collectors) {
	window.guardian = {
		...window.guardian,
		tracking: {
			...window.guardian?.tracking,
			collectors,
		},
	};
}

const collectAll = () => {
	/* do nothing */
};

/**
 * Initialise data collection scheduler
 * @param {string} label The label to identify the data
 * @param {Collector} collector The function to collect data at page unload
 * @returns {Track} Call this function with a boolean to collect data at page unload
 */
export const initTracker =
	(label: string, collector: Collector): Track =>
	(collect) => {
		if (!collect) {
			console.warn(`No consent for “${label}” logging`);
			if (collectors[label]) {
				console.warn(`Removing “${label}” logging`);
				delete collectors[label];
			}
			return;
		}

		if (collectors[label]) {
			console.warn(`Overriding “${label}” logging`);
		}

		collectors[label] = collector;

		addEventListener('visibilitychange', collectAll);
		addEventListener('pagehide', collectAll);
	};
