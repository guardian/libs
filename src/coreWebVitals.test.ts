import type { Metric, ReportHandler } from 'web-vitals';
import type { CoreWebVitalsPayload } from './coreWebVitals';
import { _, coreWebVitals } from './coreWebVitals';

const { roundWithDecimals, sendData } = _;

const coreWebVitalsPayload: CoreWebVitalsPayload = {
	page_view_id: '123456',
	browser_id: 'abcdef',
	fid: 50.5,
	fcp: 100.1,
	lcp: 150,
	ttfb: 9.99,
	cls: 0.01,
};

jest.mock('web-vitals', () => ({
	getTTFB: (onReport: ReportHandler) => {
		onReport({
			value: coreWebVitalsPayload.ttfb,
			name: 'TTFB',
		} as Metric);
	},
	getFCP: (onReport: ReportHandler) => {
		onReport({
			value: coreWebVitalsPayload.fcp,
			name: 'FCP',
		} as Metric);
	},
	getCLS: (onReport: ReportHandler) => {
		onReport({
			value: coreWebVitalsPayload.cls,
			name: 'CLS',
		} as Metric);
	},
	getFID: (onReport: ReportHandler) => {
		onReport({
			value: coreWebVitalsPayload.fid,
			name: 'FID',
		} as Metric);
	},
	getLCP: (onReport: ReportHandler) => {
		onReport({
			value: coreWebVitalsPayload.lcp,
			name: 'LCP',
		} as Metric);
	},
}));

navigator.sendBeacon = jest.fn();

describe('coreWebVitals', () => {
	it.todo('registers callbacks');
});

describe('roundWithDecimals', () => {
	it.each([
		[1, 3, 3],
		[1, 10.0, 10],
		[1, 10.3, 10.3],
		[1, 2.5, 2.5],
		[3, 0.001_234, 0.001],
		[4, 0.001_234, 0.001_2],
		[5, 100.102_030_405_060_708_090, 100.102_03],
		[6, 12345.000_001_2, 12345.000_001],
		[9, 199.001_002_003_456, 199.001_002_003],
	])('With precision %s, %f becomes %f', (precision, before, after) => {
		expect(roundWithDecimals(before, precision)).toBe(after);
	});

	it('should handle default precision = 6', () => {
		const [before, after] = [12345.000_001_2, 12345.000_001];
		expect(roundWithDecimals(before)).toBe(after);
		expect(roundWithDecimals(before, 6)).toBe(after);
	});
});

describe('sendData', () => {
	beforeAll(() => {
		jest.spyOn(global.Math, 'random');
	});

	afterAll(() => {
		jest.spyOn(global.Math, 'random').mockRestore();
	});

	beforeEach(() => {
		jest.resetModules();
	});

	it('should not send data if not in sample', () => {
		(global.Math.random as jest.Mock).mockReturnValue(2 / 10);
		coreWebVitals({
			browserId: String(coreWebVitalsPayload.browser_id),
			pageViewId: String(coreWebVitalsPayload.page_view_id),
		});
		expect(sendData()).toBe(false);
	});
	it('should send data if in sample', () => {
		(global.Math.random as jest.Mock).mockReturnValue(0.09 / 100);
		coreWebVitals({
			browserId: String(coreWebVitalsPayload.browser_id),
			pageViewId: String(coreWebVitalsPayload.page_view_id),
		});
		(navigator.sendBeacon as jest.Mock).mockReturnValue(true);
		expect(sendData()).toBe(true);
	});
});
