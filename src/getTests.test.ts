import fetchMock from 'jest-fetch-mock';
import { __resetCachedValue, getTests } from './getTests';
import type { Tests } from './types/tests';

fetchMock.enableMocks();

const fixture: Tests = {
	testA: 'control',
	testB: 'variant',
};

describe('getTests', () => {
	beforeEach(() => {
		__resetCachedValue();
		delete window.guardian;
	});

	it('gets tests from window.guardian.config', async () => {
		window.guardian = { config: { tests: fixture } };
		const tests = await getTests();
		expect(tests).toMatchObject(fixture);
	});

	it('fetches the remote config if local is missing', async () => {
		fetchMock.mockResponseOnce(JSON.stringify(fixture));
		const tests = await getTests();
		expect(tests).toMatchObject(fixture);
	});

	it('returns an empty object if there are no tests in the system', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({}));
		const switches = await getTests();
		expect(switches).toMatchObject({});
	});

	it('rejects if the test config is malformed', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				tests: { badTest: Infinity },
			}),
		);
		await expect(getTests()).rejects.toThrow(
			'remote test config is malformed',
		);
	});

	it('rejects if the fetch response is malformed', async () => {
		fetchMock.mockResponseOnce('rewgrewgwegew');
		await expect(getTests()).rejects.toThrow('invalid json');
	});

	it('rejects if the fetch fails', async () => {
		fetchMock.mockRejectOnce();
		await expect(getTests()).rejects.toBeUndefined();
	});
});
