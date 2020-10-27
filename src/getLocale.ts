import { storage } from './storage';
import type { CountryCode } from './types/countries';

const KEY = 'gu.geolocation';
const URL = 'https://api.nextgen.guardianapps.co.uk/geolocation';

const isString = (_: unknown) => {
	return Object.prototype.toString.call(_) === '[object String]';
};
const isValidCountryCode = (country: unknown) =>
	isString(country) && /^[A-Z]{2}$/.test(country as string);

export const getLocale = async (): Promise<CountryCode | null> => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- it _is_ any
	const stored = storage.local.get(KEY);

	if (isValidCountryCode(stored)) return stored as CountryCode;

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- it's json
	const { country } = await fetch(URL).then((response) => response.json());

	if (isValidCountryCode(country)) {
		storage.local.set(KEY, country);
		return country as CountryCode;
	}

	return null;
};
