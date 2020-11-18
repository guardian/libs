import fetchMock from 'jest-fetch-mock';
import { __resetCachedValue, getSwitches } from './getSwitches';
import type { Switches } from './types/window';

fetchMock.enableMocks();

const config: { switches: Switches } = {
	switches: {
		switchA: true,
		switchB: false,
	},
};

describe('getSwitches', () => {
	beforeEach(() => {
		__resetCachedValue();
		delete window.guardian;
	});

	it('gets switches from window.guardian.config', async () => {
		window.guardian = { config };
		const switches = await getSwitches();
		expect(switches).toMatchObject(config.switches);
	});

	it('fetches the remote config if local is missing', async () => {
		fetchMock.mockResponseOnce(JSON.stringify(config));
		const switches = await getSwitches();
		expect(switches).toMatchObject(config.switches);
	});

	it('returns an empty object if there are no switches in the system', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ switches: {} }));
		const switches = await getSwitches();
		expect(switches).toMatchObject({});
	});

	it('rejects if the switch config is malformed', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				switches: { badSwitch: 'this is not a boolean' },
			}),
		);
		await expect(getSwitches()).rejects.toThrow(
			'remote switch config is malformed',
		);
	});

	it('rejects if the fetch response is malformed', async () => {
		fetchMock.mockResponseOnce('rewgrewgwegew');
		await expect(getSwitches()).rejects.toThrow('invalid json');
	});

	it('rejects if the fetch fails', async () => {
		fetchMock.mockRejectOnce();
		await expect(getSwitches()).rejects.toBeUndefined();
	});
});
