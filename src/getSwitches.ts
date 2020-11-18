import { isBoolean } from './isBoolean';
import { isObject } from './isObject';
import type { Switches } from './types/switches';

const URL = '';

const validate = (switches: unknown) =>
	isObject(switches) && Object.values(switches).every(isBoolean);

const fetchRemote = () =>
	fetch(URL)
		.then((response) => response.json())
		.then((switches) =>
			validate(switches)
				? (switches as Switches)
				: Promise.reject(
						new Error('remote switch config is malformed'),
				  ),
		);

// cache to store any retrieved switches
let switches: Switches | undefined;

/**
 * Get the active guardian switch config
 */

export const getSwitches = async (): Promise<Switches> =>
	(switches ||= window.guardian?.config?.switches ?? (await fetchRemote()));

export const __resetCachedValue = (): void => (switches = void 0);
