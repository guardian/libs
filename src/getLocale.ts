import { isString } from './isString';
import { storage } from './storage';
import type { CountryCode } from './types/countries';

const KEY = 'gu.geolocation';
const URL = 'https://api.nextgen.guardianapps.co.uk/geolocation';

// best guess that we have a valid code, without actually shipping the entire list
const isValidCountryCode = (country: unknown) =>
	isString(country) && /^[A-Z]{2}$/.test(country as string);

const daysFromNow = (days: number) =>
	new Date().getTime() + 60 * 60 * 24 * days;

/**
 * Fetches the user's current location as an ISO 3166-1 alpha-2 string e.g. 'GB', 'AU' etc
 */

export const getLocale = async (): Promise<CountryCode | null> => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- it _is_ any
	const stored = storage.local.get(KEY);

	// if we've got a locale, return it
	if (isValidCountryCode(stored)) return stored as CountryCode;

	// use our API to get one
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- it's json
		const { country } = await fetch(URL).then((response) =>
			response.json(),
		);

		if (isValidCountryCode(country)) {
			// save it for 10 days
			storage.local.set(KEY, country, daysFromNow(10));

			// return it
			return country as CountryCode;
		}
	} catch (e) {
		// do nothing
	}

	return null;
};
