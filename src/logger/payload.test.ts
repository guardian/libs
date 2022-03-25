import { recordLog } from './payload';

const mockBeacon = jest.fn().mockReturnValue(true);
navigator.sendBeacon = mockBeacon;

describe('Record logs to the data lake', () => {
	it('should send data to PROD by default', () => {
		recordLog('test', {});
		expect(mockBeacon).toHaveBeenCalledWith(
			'https://logs.guardianapis.com/log',
			JSON.stringify({ label: 'test', properties: [], metrics: [] }),
		);
	});

	it('should send data to CODE when isDev=true', () => {
		recordLog('test', { isDev: true });
		expect(mockBeacon).toHaveBeenCalledWith(
			'https://logs.code.dev-guardianapis.com/log',
			JSON.stringify({ label: 'test', properties: [], metrics: [] }),
		);
	});

	it('should handle nominal data', () => {
		recordLog('test', {
			properties: { device: 'mobile', section: 'sports' },
		});
		expect(mockBeacon).toHaveBeenCalledWith(
			'https://logs.guardianapis.com/log',
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

	it('should handle nominal data', () => {
		recordLog('test', {
			metrics: { speed: 120, height: 321 },
		});
		expect(mockBeacon).toHaveBeenCalledWith(
			'https://logs.guardianapis.com/log',
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

	it('should not send a beacon if label is missing', () => {
		//@ts-expect-error -- we’re omitting the label
		recordLog();
		recordLog('', {});
		expect(mockBeacon).not.toHaveBeenCalled();
	});
});
