import { isBoolean } from './isBoolean';
import { isObject } from './isObject';
import type { Switches } from './types/window';

const URL = '';

const validate = (switches: unknown) =>
	isObject(switches) && Object.values(switches).every(isBoolean);

const fetchRemote = async () => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- it's json
		const { switches } = await fetch(URL).then((response) =>
			response.json(),
		);

		if (validate(switches)) {
			return switches as Switches;
		}
	} catch (e) {
		return;
	}
};

let switches: Switches | undefined;

/**
 * Get the current guardian switches
 */

export const getSwitches = async (): Promise<Switches | undefined> => {
	switches ||= window.guardian?.config?.switches;
	return switches ?? (await fetchRemote());
};

export const __reset = (): void => (switches = void 0);
