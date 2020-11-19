import { isObject } from './isObject';
import type { Experiments } from './types/experiments';

const URL = 'https://www.theguardian.com/experiments.json';

const isVariantOrControl = (value: unknown): boolean =>
	value === 'variant' || value === 'control';

const validate = (experiments: unknown) =>
	isObject(experiments) &&
	Object.values(experiments).every(isVariantOrControl);

const fetchRemote = async () =>
	fetch(URL)
		.then((response) => response.json())
		.then((experiments) =>
			validate(experiments)
				? (experiments as Experiments)
				: Promise.reject(new Error('remote test config is malformed')),
		);

// cache to store any retrieved experiments
let experiments: Experiments | undefined;

/**
 * Get the active guardian test config
 */

export const getExperiments = async (): Promise<Experiments> =>
	(experiments ||=
		window.guardian?.config?.experiments ?? (await fetchRemote()));

/**
 * Check if user is in a test
 */

export const isInTestControlFor = async (name: string): Promise<boolean> =>
	(await getExperiments())[name] === 'control';

export const __resetCachedValue = (): void => (experiments = void 0);
