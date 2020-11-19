import fetchMock from 'jest-fetch-mock';
import { __resetCachedValue, getExperiments } from './getExperiments';
import type { Experiments } from './types/experiments';

fetchMock.enableMocks();

const fixture: Experiments = {
	testA: 'control',
	testB: 'variant',
};

describe('getExperiments', () => {
	beforeEach(() => {
		__resetCachedValue();
		delete window.guardian;
	});

	it('gets experiments from window.guardian.config', async () => {
		window.guardian = { config: { experiments: fixture } };
		const experiments = await getExperiments();
		expect(experiments).toMatchObject(fixture);
	});

	it('fetches the remote config if local is missing', async () => {
		fetchMock.mockResponseOnce(JSON.stringify(fixture));
		const experiments = await getExperiments();
		expect(experiments).toMatchObject(fixture);
	});

	it('returns an empty object if there are no experiments in the system', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({}));
		const switches = await getExperiments();
		expect(switches).toMatchObject({});
	});

	it('rejects if the test config is malformed', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				experiments: { badTest: Infinity },
			}),
		);
		await expect(getExperiments()).rejects.toThrow(
			'remote test config is malformed',
		);
	});

	it('rejects if the fetch response is malformed', async () => {
		fetchMock.mockResponseOnce('rewgrewgwegew');
		await expect(getExperiments()).rejects.toThrow('invalid json');
	});

	it('rejects if the fetch fails', async () => {
		fetchMock.mockRejectOnce();
		await expect(getExperiments()).rejects.toBeUndefined();
	});
});
