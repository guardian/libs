import type { Metric, ReportHandler } from 'web-vitals';
import type { CoreWebVitalsPayload } from './coreWebVitals';
import { _, coreWebVitals, forceSendMetrics } from './coreWebVitals';

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

const mockMath = jest.spyOn(global.Math, 'random');
mockMath.mockReturnValue(99 / 100);

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
		coreWebVitals({ browserId: 'abc', pageViewId: '123' }, mockCallback);

		setVisibilityState('hidden');
		global.dispatchEvent(new Event('visibilitychange'));
		global.dispatchEvent(new Event('pagehide'));

		expect(mockCallback).toBeCalledTimes(2);
		expect(mockCallback).toBeCalledWith(false);
	});

	it('only registers pagehide if document is visible', () => {
		const mockCallback = jest.fn();
		coreWebVitals({ browserId: 'abc', pageViewId: '123' }, mockCallback);

		setVisibilityState('visible');
		global.dispatchEvent(new Event('visibilitychange'));
		global.dispatchEvent(new Event('pagehide'));

		expect(mockCallback).toBeCalledTimes(1);
		expect(mockCallback).toBeCalledWith(false);
	});

	it.todo('trigger simluated events – maybe EventEmitter?');
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

	const setLocation = (hostname: string) => {
		Object.defineProperty(window, 'location', {
			writable: true,
			value: { hostname },
		});
	};

	const browserId = String(defaultCoreWebVitalsPayload.browser_id);
	const pageViewId = String(defaultCoreWebVitalsPayload.page_view_id);

	it('should send data if in sample', () => {
		mockMath.mockReturnValueOnce(0.1 / 100);
		coreWebVitals({ browserId, pageViewId });

		expect(sendData()).toBe(true);
	});

	it('should not send data if not in sample', () => {
		coreWebVitals({ browserId, pageViewId });

		expect(sendData()).toBe(false);
	});

	it('should send data if not in sample but forced via init', () => {
		coreWebVitals({
			browserId,
			pageViewId,
			forceSendMetrics: true,
		});

		expect(sendData()).toBe(true);
	});

	it('should send data if not in sample but forced via hash', () => {
		window.location.hash = '#forceSendMetrics';
		coreWebVitals({ browserId, pageViewId });

		expect(sendData()).toBe(true);
	});

	it('should send data if forced asynchronously', () => {
		coreWebVitals({ browserId, pageViewId });

		expect(sendData()).toBe(false);

		forceSendMetrics();
		expect(sendData()).toBe(true);
	});

	it('should use PROD URL by default', () => {
		coreWebVitals({ browserId, pageViewId });
		forceSendMetrics();

		setLocation('www.theguardian.com');
		sendData();
		expect(mockBeacon).toHaveBeenCalledWith(
			'https://performance-events.guardianapis.com/core-web-vitals',
			expect.any(String),
		);
	});

	it('should use CODE URL on localhost', () => {
		coreWebVitals({ browserId, pageViewId });
		forceSendMetrics();

		setLocation('localhost');
		sendData();
		expect(mockBeacon).toHaveBeenCalledWith(
			'https://performance-events.code.dev-guardianapis.com/core-web-vitals',
			expect.any(String),
		);
	});
});
