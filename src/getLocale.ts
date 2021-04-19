import { getCookie, setSessionCookie } from './cookies';
import { isString } from './isString';
import type { CountryCode } from './types/countries';

const KEY = 'GU_geo_country';
const URL = 'https://api.nextgen.guardianapps.co.uk/geolocation';

// best guess that we have a valid code, without actually shipping the entire list
const isValidCountryCode = (country: unknown) =>
	isString(country) && /^[A-Z]{2}$/.test(country as string);

// we'll cache any successful lookups so we only have to do this once
let locale: CountryCode | undefined;

// just used for tests
export const __resetCachedValue = (): void => (locale = void 0);

/**
 * Fetches the user's current location as an ISO 3166-1 alpha-2 string e.g. 'GB', 'AU' etc
 */

export const getLocale = async (): Promise<CountryCode | null> => {
	if (locale) return locale;

	// return locale from cookie if it exists
	const fromCookie = getCookie('GU_geo_country');

	if (fromCookie && isValidCountryCode(fromCookie)) {
		return (locale = fromCookie as CountryCode);
	}

	// use our API to get one
	try {
		const { country } = (await fetch(URL).then((response) =>
			response.json(),
		)) as { country: CountryCode };

		if (isValidCountryCode(country)) {
			setSessionCookie(KEY, country);

			// return it
			return (locale = country);
		}
	} catch (e) {
		// do nothing
	}

	return null;
};
