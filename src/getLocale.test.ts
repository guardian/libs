import fetchMock from 'jest-fetch-mock';
import * as cookies from './cookies';
import { __resetCachedValue, getLocale } from './getLocale';

const KEY = 'GU_geo_country';

fetchMock.enableMocks();

describe('getLocale', () => {
	beforeEach(() => {
		cookies.cleanUp([KEY]);
		__resetCachedValue();
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
