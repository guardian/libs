import { getLoggingEndpoint, recordLog } from './record';

const mockBeacon = jest.fn().mockReturnValue(true);
navigator.sendBeacon = mockBeacon;

const mockFetch = jest.fn().mockResolvedValue(true);
window.fetch = mockFetch;

describe('Record logs to an endpoint', () => {
	const endpoint = 'https://example.com/';

	it('should send data to specified endpoint', () => {
		recordLog({ label: 'test', endpoint });
		expect(mockBeacon).toHaveBeenCalledWith(
			endpoint,
			JSON.stringify({ label: 'test', properties: [], metrics: [] }),
		);
	});

	it('should handle nominal data (strings)', () => {
		recordLog({
			label: 'test',
			endpoint,
			properties: { device: 'mobile', section: 'sports' },
		});
		expect(mockBeacon).toHaveBeenCalledWith(
			endpoint,
			JSON.stringify({
				label: 'test',
				properties: [
					{
						name: 'device',
						value: 'mobile',
					},
					{
						name: 'section',
						value: 'sports',
					},
				],
				metrics: [],
			}),
		);
	});

	it('should handle numerical data (numbers)', () => {
		recordLog({
			label: 'test',
			endpoint,
			metrics: { speed: 120, height: 321 },
		});
		expect(mockBeacon).toHaveBeenCalledWith(
			endpoint,
			JSON.stringify({
				label: 'test',
				properties: [],
				metrics: [
					{
						name: 'speed',
						value: 120,
					},
					{
						name: 'height',
						value: 321,
					},
				],
			}),
		);
	});

	describe('failure modes', () => {
		it('should not send a beacon if label is missing', () => {
			//@ts-expect-error -- we’re omitting the label
			recordLog({});
			expect(mockBeacon).not.toHaveBeenCalled();
		});

		it('should not send a beacon if endpoint is missing', () => {
			//@ts-expect-error -- we’re omitting the endpoint
			recordLog({ label: 'test' });
			recordLog({ label: 'test', endpoint: '' });
			expect(mockBeacon).not.toHaveBeenCalled();
		});
	});

	describe('sendBeacon fallback', () => {
		beforeAll(() => {
			// @ts-expect-error -- we’re removing sendBeacon
			delete navigator.sendBeacon;
		});
		afterAll(() => {
			navigator.sendBeacon = mockBeacon;
		});

		it('use fetch fallback if missing', () => {
			recordLog({ label: 'test', endpoint });
			expect(mockBeacon).not.toHaveBeenCalled();
			expect(mockFetch).toHaveBeenCalledWith(endpoint, {
				body: JSON.stringify({
					label: 'test',
					properties: [],
					metrics: [],
				}),
			});
		});

		it('returns false if fetch failed', () => {
			// @ts-expect-error -- we’re removing fetch
			delete window.fetch;

			const queued = recordLog({ label: 'test', endpoint });
			expect(queued).toBe(false);

			window.fetch = mockFetch;
		});
	});
});

describe('getLoggingEndpoint', () => {
	it('should get PROD endpoint if isDev is false', () => {
		expect(getLoggingEndpoint(false)).toBe(
			'https://logs.guardianapis.com/log',
		);
	});
	it('should get PROD endpoint if isDev is false', () => {
		expect(getLoggingEndpoint(true)).toBe(
			'https://logs.code.dev-guardianapis.com/log',
		);
	});
});
