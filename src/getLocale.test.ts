import fetchMock from 'jest-fetch-mock';
import * as cookies from './cookies';
import { __resetCachedValue, getLocale } from './getLocale';
import { storage } from './storage';

const KEY = 'GU_geo_country';
const KEY_OVERRIDE = 'gu.geo.override';

fetchMock.enableMocks();

describe('getLocale', () => {
	beforeEach(() => {
		storage.local.clear();
		cookies.removeCookie(KEY);
		__resetCachedValue();
	});

	it('returns overridden locale if it exists', async () => {
		storage.local.set(KEY_OVERRIDE, 'CY');
		cookies.setSessionCookie(KEY, 'GB');
		const locale = await getLocale();
		expect(locale).toBe('CY');
	});

	it('gets a stored valid locale', async () => {
		cookies.setSessionCookie(KEY, 'CY');
		const locale = await getLocale();
		expect(locale).toBe('CY');
	});

	it('fetches the remote value if cookie is missing', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ country: 'CZ' }));
		const locale = await getLocale();
		expect(locale).toBe('CZ');
		expect(cookies.getCookie(KEY)).toBe('CZ');
	});

	it('ignores a stored invalid locale', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ country: 'CZ' }));
		cookies.setSessionCookie(KEY, 'outerspace');
		const locale = await getLocale();
		expect(locale).toBe('CZ');
		expect(cookies.getCookie(KEY)).toBe('CZ');
	});

	it('ignores an invalid remote response', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ country: 'outerspace' }));
		const locale = await getLocale();
		expect(locale).toBeNull();
		expect(cookies.getCookie(KEY)).toBeNull();
	});

	it('ignores an error in the remote response', async () => {
		fetchMock.mockResponseOnce('regregergreg');
		const locale = await getLocale();
		expect(locale).toBeNull();
		expect(cookies.getCookie(KEY)).toBeNull();
	});

	it('uses the cached value if available', async () => {
		const spy = jest.spyOn(cookies, 'getCookie');

		cookies.setSessionCookie(KEY, 'CY');
		const locale = await getLocale();
		const locale2 = await getLocale();

		expect(locale).toBe(locale2);
		expect(spy).toHaveBeenCalledTimes(1);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
