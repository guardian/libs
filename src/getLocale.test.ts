import fetchMock from 'jest-fetch-mock';
import { getLocale } from './getLocale';
import { storage } from './storage';

const KEY = 'gu.geolocation';

fetchMock.enableMocks();

describe('getLocale', () => {
	beforeEach(() => {
		storage.local.clear();
	});

	it('gets a stored valid locale', async () => {
		storage.local.set(KEY, 'CY');
		const locale = await getLocale();
		expect(locale).toBe('CY');
	});

	it('fetches the remote value is local is missing', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ country: 'CZ' }));
		const locale = await getLocale();
		expect(locale).toBe('CZ');
	});

	it('ignores a stored invalid locale', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ country: 'CZ' }));
		storage.local.set(KEY, 'outerspace');
		const locale = await getLocale();
		expect(locale).toBe('CZ');
		expect(storage.local.get(KEY)).toBe('CZ');
	});

	it('ignores an invalid remote response', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ country: 'outerspace' }));
		const locale = await getLocale();
		expect(locale).toBeNull();
		expect(storage.local.get(KEY)).toBeNull();
	});

	it('ignores an error in the remote response', async () => {
		fetchMock.mockResponseOnce('regregergreg');
		const locale = await getLocale();
		expect(locale).toBeNull();
		expect(storage.local.get(KEY)).toBeNull();
	});
});