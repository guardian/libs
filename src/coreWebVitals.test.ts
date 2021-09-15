import type { Metric, ReportHandler } from 'web-vitals';
import type { CoreWebVitalsPayload } from './coreWebVitals';
import { _, bypassSampling, initCoreWebVitals } from './coreWebVitals';

const { roundWithDecimals, sendData, resetShouldForceMetrics } = _;

const defaultCoreWebVitalsPayload: CoreWebVitalsPayload = {
	page_view_id: '123456',
	browser_id: 'abcdef',
	fid: 50.5,
	fcp: 100.1,
	lcp: 150,
	ttfb: 9.99,
	cls: 0.01,
};

const browserId = defaultCoreWebVitalsPayload.browser_id;
const pageViewId = defaultCoreWebVitalsPayload.page_view_id;

jest.mock('web-vitals', () => ({
	getTTFB: (onReport: ReportHandler) => {
		onReport({
			value: defaultCoreWebVitalsPayload.ttfb,
			name: 'TTFB',
		} as Metric);
	},
	getFCP: (onReport: ReportHandler) => {
		onReport({
			value: defaultCoreWebVitalsPayload.fcp,
			name: 'FCP',
		} as Metric);
	},
	getCLS: (onReport: ReportHandler) => {
		onReport({
			value: defaultCoreWebVitalsPayload.cls,
			name: 'CLS',
		} as Metric);
	},
	getFID: (onReport: ReportHandler) => {
		onReport({
			value: defaultCoreWebVitalsPayload.fid,
			name: 'FID',
		} as Metric);
	},
	getLCP: (onReport: ReportHandler) => {
		onReport({
			value: defaultCoreWebVitalsPayload.lcp,
			name: 'LCP',
		} as Metric);
	},
}));

const mockBeacon = jest.fn().mockReturnValue(true);
navigator.sendBeacon = mockBeacon;

const mockConsoleWarn = jest
	.spyOn(console, 'warn')
	.mockImplementation(() => void 0);

const setVisibilityState = (value: VisibilityState = 'visible') => {
	Object.defineProperty(document, 'visibilityState', {
		writable: true,
		configurable: true,
		value,
	});
};

describe('coreWebVitals', () => {
	afterAll(() => {
		setVisibilityState();
	});

	it('registers callbacks', () => {
		const mockCallback = jest.fn();
		initCoreWebVitals(
			{ browserId, pageViewId, isDev: true, sampling: 0 },
			mockCallback,
		);

		setVisibilityState('hidden');
		global.dispatchEvent(new Event('visibilitychange'));
		global.dispatchEvent(new Event('pagehide'));

		expect(mockCallback).toBeCalledTimes(2);
		expect(mockCallback).toBeCalledWith(false);
	});

	it('only registers pagehide if document is visible', () => {
		const mockCallback = jest.fn();
		initCoreWebVitals({ browserId, pageViewId, isDev: true }, mockCallback);

		setVisibilityState('visible');
		global.dispatchEvent(new Event('visibilitychange'));

		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('does not trigger a callback if none is passed', () => {
		const mockCallback = jest.fn(); // won’t be used
		const mockAddEventListener = jest.spyOn(global, 'addEventListener');
		initCoreWebVitals({ browserId, pageViewId, isDev: true });

		setVisibilityState('hidden');
		global.dispatchEvent(new Event('visibilitychange'));
		global.dispatchEvent(new Event('pagehide'));

		expect(mockAddEventListener).toHaveBeenCalledTimes(2);

		expect(mockCallback).not.toHaveBeenCalled();
	});
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
	beforeEach(() => {
		jest.resetModules();
		window.location.hash = '';
		resetShouldForceMetrics();
	});

	it('should send data if in sample', () => {
		initCoreWebVitals({ browserId, pageViewId, isDev: true, sampling: 1 });

		expect(sendData(true)).toBe(true);
	});

	it('should not send data if not in sample', () => {
		initCoreWebVitals({ browserId, pageViewId, isDev: true });

		expect(sendData(true)).toBe(false);
	});

	it('should send data if sampling at 0% but bypassed at init', () => {
		initCoreWebVitals({
			browserId,
			pageViewId,
			isDev: true,
			sampling: 0,
			bypassSampling: true,
		});

		expect(sendData(true)).toBe(true);
	});

	it('should send data if sampling at 0% but bypassed via hash', () => {
		window.location.hash = '#bypassSampling';

		initCoreWebVitals({
			browserId,
			pageViewId,
			isDev: true,
			sampling: 0,
			bypassSampling: false,
		});

		expect(sendData(true)).toBe(true);
	});

	it('should send data if sampling at 0% but bypassed asynchronously', () => {
		initCoreWebVitals({
			browserId,
			pageViewId,
			isDev: true,
			sampling: 0,
			bypassSampling: false,
		});

		expect(sendData(true)).toBe(false);

		bypassSampling();

		expect(sendData(true)).toBe(true);
	});

	it('should use CODE URL if isDev', () => {
		initCoreWebVitals({ browserId, pageViewId, isDev: true, sampling: 1 });
		bypassSampling();

		sendData(false);
		expect(mockBeacon).toHaveBeenCalledWith(
			'https://performance-events.guardianapis.com/core-web-vitals',
			expect.any(String),
		);
	});

	it('should use PROD URL if isDev is false', () => {
		initCoreWebVitals({
			browserId,
			pageViewId,
			isDev: false,
			sampling: 1,
		});

		sendData(true);
		expect(mockBeacon).toHaveBeenCalledWith(
			'https://performance-events.code.dev-guardianapis.com/core-web-vitals',
			expect.any(String),
		);
	});
});
