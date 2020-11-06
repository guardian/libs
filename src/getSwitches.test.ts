import fetchMock from 'jest-fetch-mock';
import { __reset, getSwitches } from './getSwitches';
import type { Switches } from './types/window';

fetchMock.enableMocks();

const fixture: { switches: Switches } = {
	switches: {
		switchA: true,
		switchB: false,
	},
};

const setConfig = () => {
	window.guardian = { config: fixture };
};

describe('getSwitches', () => {
	beforeEach(() => {
		__reset();
		delete window.guardian;
	});

	it('gets switches from guardian config', async () => {
		setConfig();
		const switches = await getSwitches();
		expect(switches).toMatchObject(fixture.switches);
	});

	it('fetches the remote config if local is missing', async () => {
		fetchMock.mockResponseOnce(JSON.stringify(fixture));
		const switches = await getSwitches();
		expect(switches).toMatchObject(fixture.switches);
	});

	it('resolves nothing if the switches are malformed', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				switches: { badSwitch: 'this is not a boolean' },
			}),
		);
		const switches = await getSwitches();
		expect(switches).toBeUndefined();
	});

	it('resolves nothing if the fetch response is malformed', async () => {
		fetchMock.mockResponseOnce('rewgrewgwegew');
		const switches = await getSwitches();
		expect(switches).toBeUndefined();
	});

	it('resolves nothing if the fetch fails', async () => {
		fetchMock.mockRejectOnce();
		const switches = await getSwitches();
		expect(switches).toBeUndefined();
	});
});
