import { isObject } from './isObject';
import type { Tests } from './types/window';

const URL = '';

const validate = (tests: unknown) =>
	isObject(tests) &&
	Object.values(tests).every(
		(value) => value === 'variant' || value === 'control',
	);

const fetchRemote = async () =>
	fetch(URL)
		.then((response) => response.json())
		.then(({ tests }) =>
			validate(tests)
				? (tests as Tests)
				: Promise.reject(new Error('remote test config is malformed')),
		);

// cache to store any retrieved tests
let tests: Tests | undefined;

/**
 * Get the active guardian test config
 */

export const getTests = async (): Promise<Tests> =>
	(tests ||= window.guardian?.config?.tests ?? (await fetchRemote()));

export const __resetCachedValue = (): void => (tests = void 0);
