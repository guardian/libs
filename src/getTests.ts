import { isObject } from './isObject';
import type { Tests } from './types/window';

const URL = '';

const validate = (tests: unknown) =>
	isObject(tests) &&
	Object.values(tests).every(
		(value) => value === 'variant' || value === 'control',
	);

const fetchRemote = async () => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- it's json
		const { tests } = await fetch(URL).then((response) => response.json());

		if (validate(tests)) {
			return tests as Tests;
		}
	} catch (e) {
		return;
	}
};

let tests: Tests | undefined;

/**
 * Get the current guardian tests
 */

export const getTests = async (): Promise<Tests | undefined> => {
	tests ||= window.guardian?.config?.tests;
	return tests ?? (await fetchRemote());
};

export const __reset = (): void => (tests = void 0);
