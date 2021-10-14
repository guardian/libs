import type { Metric, ReportHandler } from 'web-vitals';
import type { CoreWebVitalsPayload } from './coreWebVitals';
import {
	_,
	bypassCoreWebVitalsSampling,
	initCoreWebVitals,
} from './coreWebVitals';
import * as logObject from './logger';

const { roundWithDecimals, coreWebVitalsPayload, reset } = _;

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

const spyLog = jest.spyOn(logObject, 'log');

const setVisibilityState = (value: VisibilityState = 'visible') => {
	Object.defineProperty(document, 'visibilityState', {
		writable: true,
		configurable: true,
		value,
	});
};

describe('coreWebVitals', () => {
	beforeEach(() => {
		reset();
	});

	afterAll(() => {
		setVisibilityState();
	});

	it('sends a beacon when sampling is 100%', () => {
		const mockAddEventListener = jest.spyOn(global, 'addEventListener');

		const sampling = 100 / 100;
		initCoreWebVitals({ browserId, pageViewId, isDev: true, sampling });

		expect(mockAddEventListener).toHaveBeenCalledTimes(2);

		setVisibilityState('hidden');
		global.dispatchEvent(new Event('visibilitychange'));
		global.dispatchEvent(new Event('pagehide'));

		expect(mockBeacon).toHaveBeenCalledTimes(1);
	});

	it('does not run web-vitals if sampling is 0%', () => {
		const sampling = 0 / 100;
		initCoreWebVitals({ browserId, pageViewId, isDev: true, sampling });

		setVisibilityState('hidden');
		global.dispatchEvent(new Event('visibilitychange'));
		global.dispatchEvent(new Event('pagehide'));

		expect(mockBeacon).toHaveBeenCalledTimes(0);
		expect(coreWebVitalsPayload).toMatchObject({
			fid: null,
			fcp: null,
			lcp: null,
			ttfb: null,
			cls: null,
		});
	});

	it('sends a beacon if sampling at 0% but bypassed via hash', () => {
		window.location.hash = '#bypassCoreWebVitalsSampling';
		const sampling = 0 / 100;
		initCoreWebVitals({ browserId, pageViewId, isDev: true, sampling });
		window.location.hash = '';

		global.dispatchEvent(new Event('pagehide'));

		expect(mockBeacon).toHaveBeenCalledTimes(1);
	});

	it('sends a beacon if sampling at 0% but bypassed asynchronously', () => {
		const sampling = 0 / 100;
		initCoreWebVitals({ browserId, pageViewId, isDev: true, sampling });

		expect(mockBeacon).not.toHaveBeenCalled();

		bypassCoreWebVitalsSampling();

		global.dispatchEvent(new Event('pagehide'));

		expect(mockBeacon).toHaveBeenCalledTimes(1);
	});

	it('only registers pagehide if document is visible', () => {
		initCoreWebVitals({ browserId, pageViewId, isDev: true, sampling: 1 });

		setVisibilityState('visible');
		global.dispatchEvent(new Event('visibilitychange'));

		expect(mockBeacon).not.toHaveBeenCalled();
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

describe('Warnings', () => {
	beforeEach(() => {
		reset();
	});

	it('should warn if already initialised', () => {
		initCoreWebVitals({ pageViewId, browserId, isDev: true });
		initCoreWebVitals({ pageViewId, browserId, isDev: true });

		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'initCoreWebVitals already initialised',
			expect.any(String),
		);
	});

	it('expect to be initialised before calling bypassCoreWebVitalsSampling', () => {
		bypassCoreWebVitalsSampling();

		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'initCoreWebVitals not yet initialised',
		);

		global.dispatchEvent(new Event('pagehide'));
		expect(mockBeacon).not.toHaveBeenCalled();
	});

	it('should warn if browserId is missing', () => {
		initCoreWebVitals({ pageViewId, isDev: true });

		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'browserId or pageViewId missing from Core Web Vitals.',
			expect.any(String),
			expect.objectContaining({ browserId: null }),
		);
	});

	it('should warn if pageViewId is missing', () => {
		initCoreWebVitals({ browserId, isDev: true });

		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'browserId or pageViewId missing from Core Web Vitals.',
			expect.any(String),
			expect.objectContaining({ pageViewId: null }),
		);
	});

	it('should warn if sampling is below 0', () => {
		initCoreWebVitals({
			browserId,
			pageViewId,
			isDev: true,
			sampling: -0.1,
		});

		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'Core Web Vitals sampling is outside the 0 to 1 range: ',
			-0.1,
		);
	});

	it('should warn if sampling is above 1', () => {
		initCoreWebVitals({
			browserId,
			pageViewId,
			isDev: true,
			sampling: 1.1,
		});

		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'Core Web Vitals sampling is outside the 0 to 1 range: ',
			1.1,
		);
	});

	it('should warn if sampling is above at 0%', () => {
		initCoreWebVitals({
			browserId,
			pageViewId,
			isDev: true,
			sampling: 0,
		});

		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'Core Web Vitals are sampled at 0%',
		);
	});

	it('should warn if sampling is above at 100%', () => {
		initCoreWebVitals({
			browserId,
			pageViewId,
			isDev: true,
			sampling: 1,
		});

		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'Core Web Vitals are sampled at 100%',
		);
	});
});

describe('Endpoints', () => {
	beforeEach(() => {
		reset();
	});

	it('should use CODE URL if isDev', () => {
		const isDev = true;
		initCoreWebVitals({ browserId, pageViewId, isDev, sampling: 1 });

		global.dispatchEvent(new Event('pagehide'));

		expect(mockBeacon).toHaveBeenCalledWith(
			_.Endpoints.CODE,
			expect.any(String),
		);
	});

	it('should use PROD URL if isDev is false', () => {
		const isDev = false;
		initCoreWebVitals({ browserId, pageViewId, isDev, sampling: 1 });

		global.dispatchEvent(new Event('pagehide'));

		expect(mockBeacon).toHaveBeenCalledWith(
			_.Endpoints.PROD,
			expect.any(String),
		);
	});
});

describe('Logging', () => {
	beforeEach(() => {
		reset();
		setVisibilityState();
	});

	it('should log for every team that registered', () => {
		const isDev = true;
		initCoreWebVitals({ browserId, pageViewId, isDev, team: 'dotcom' });
		bypassCoreWebVitalsSampling('design');
		bypassCoreWebVitalsSampling('commercial');

		setVisibilityState('hidden');
		global.dispatchEvent(new Event('visibilitychange'));

		expect(spyLog).toHaveBeenCalledTimes(3);
		expect(spyLog).nthCalledWith(
			1,
			'dotcom',
			expect.stringContaining('successfully'),
		);
		expect(spyLog).nthCalledWith(
			2,
			'design',
			expect.stringContaining('successfully'),
		);
		expect(spyLog).nthCalledWith(
			3,
			'commercial',
			expect.stringContaining('successfully'),
		);
	});

	it('should log a failure if it happens', () => {
		const mockAddEventListener = jest.spyOn(global, 'addEventListener');
		const isDev = true;
		const sampling = 100 / 100;
		initCoreWebVitals({
			browserId,
			pageViewId,
			isDev,
			sampling,
			team: 'dotcom',
		});

		mockBeacon.mockReturnValueOnce(false);

		setVisibilityState('hidden');
		global.dispatchEvent(new Event('visibilitychange'));

		expect(mockAddEventListener).toHaveBeenCalledTimes(2);

		expect(spyLog).toHaveBeenCalledTimes(1);
		expect(spyLog).toHaveBeenLastCalledWith(
			'dotcom',
			expect.stringContaining('Failed to queue'),
		);
	});
});

describe('web-vitals', () => {
	beforeEach(() => {
		reset();
		setVisibilityState();
	});

	it('should not send data if FCP is null', () => {
		const isDev = true;
		initCoreWebVitals({ browserId, pageViewId, isDev, sampling: 1 });

		_.coreWebVitalsPayload.fcp = null; // simulate a failing FCP

		setVisibilityState('hidden');
		global.dispatchEvent(new Event('visibilitychange'));

		expect(mockBeacon).not.toHaveBeenCalled();
	});
});
