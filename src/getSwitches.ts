import { isBoolean } from './isBoolean';
import { isObject } from './isObject';
import type { Switches } from './types/window';

const URL = '';

// cache to store any retrieved switches
let switches: Switches | undefined;

const validate = (switches: unknown) =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call -- isObject handles any arg
	isObject(switches) && Object.values(switches).every(isBoolean);

const fetchRemote = () =>
	fetch(URL)
		.then((response) => response.json())
		.then(({ switches }) =>
			validate(switches)
				? (switches as Switches)
				: Promise.reject(
						new Error('remote switch config is malformed'),
				  ),
		);

/**
 * Get the active guardian switch config
 */

export const getSwitches = async (): Promise<Switches> =>
	(switches ||= window.guardian?.config?.switches ?? (await fetchRemote()));

export const __reset = (): void => (switches = void 0);
