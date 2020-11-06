import fetchMock from 'jest-fetch-mock';
import { __reset, getTests } from './getTests';
import type { Tests } from './types/window';

fetchMock.enableMocks();

const fixture: { tests: Tests } = {
	tests: {
		testA: 'control',
		testB: 'variant',
	},
};

const setConfig = () => {
	window.guardian = { config: fixture };
};

describe('getTests', () => {
	beforeEach(() => {
		__reset();
		delete window.guardian;
	});

	it('gets tests from guardian config', async () => {
		setConfig();
		const tests = await getTests();
		expect(tests).toMatchObject(fixture.tests);
	});

	it('fetches the remote config if local is missing', async () => {
		fetchMock.mockResponseOnce(JSON.stringify(fixture));
		const tests = await getTests();
		expect(tests).toMatchObject(fixture.tests);
	});

	it('resolves nothing if the tests are malformed', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				tests: { badSwitch: 'this is not a boolean' },
			}),
		);
		const tests = await getTests();
		expect(tests).toBeUndefined();
	});

	it('resolves nothing if the fetch response is malformed', async () => {
		fetchMock.mockResponseOnce('rewgrewgwegew');
		const tests = await getTests();
		expect(tests).toBeUndefined();
	});

	it('resolves nothing if the fetch fails', async () => {
		fetchMock.mockRejectOnce();
		const tests = await getTests();
		expect(tests).toBeUndefined();
	});
});
