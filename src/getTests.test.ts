import fetchMock from 'jest-fetch-mock';
import { __reset, getTests } from './getTests';
import type { Tests } from './types/window';

fetchMock.enableMocks();

const config: { tests: Tests } = {
	tests: {
		testA: 'control',
		testB: 'variant',
	},
};

describe('getTests', () => {
	beforeEach(() => {
		__reset();
		delete window.guardian;
	});

	it('gets tests from window.guardian.config', async () => {
		window.guardian = { config };
		const tests = await getTests();
		expect(tests).toMatchObject(config.tests);
	});

	it('fetches the remote config if local is missing', async () => {
		fetchMock.mockResponseOnce(JSON.stringify(config));
		const tests = await getTests();
		expect(tests).toMatchObject(config.tests);
	});

	it('returns an empty object if there are no tests in the system', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ tests: {} }));
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
