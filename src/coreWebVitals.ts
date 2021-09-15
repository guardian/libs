import type { ReportHandler } from 'web-vitals';
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

export type CoreWebVitalsPayload = {
	page_view_id: string | null;
	browser_id: string | null;
	fid: null | number;
	cls: null | number;
	lcp: null | number;
	fcp: null | number;
	ttfb: null | number;
};

const coreWebVitalsPayload: CoreWebVitalsPayload = {
	browser_id: null,
	page_view_id: null,
	fid: null,
	cls: null,
	lcp: null,
	fcp: null,
	ttfb: null,
};

let shouldSendMetrics = false;
export const bypassSampling = (): void => {
	shouldSendMetrics = true;
};

const roundWithDecimals = (value: number, precision = 6): number => {
	const power = Math.pow(10, precision);
	return Math.round(value * power) / power;
};

/**
 * Send the Core Web Vitals payload to our logging endpoint.
 *
 * @param isDev - whether the CODE of PROD endpoint will be used
 * @returns {boolean} - `true` if the metrics are queued for sending. `false` otherwise
 */
const sendData = (isDev: boolean): boolean => {
	if (!shouldSendMetrics || coreWebVitalsPayload.fcp === null) return false;

	const endpoint = isDev
		? 'https://performance-events.code.dev-guardianapis.com/core-web-vitals'
		: 'https://performance-events.guardianapis.com/core-web-vitals';

	return navigator.sendBeacon(endpoint, JSON.stringify(coreWebVitalsPayload));
};

const onReport: ReportHandler = (metric) => {
	switch (metric.name) {
		case 'FCP':
			// Browser support: Chromium, Firefox, Safari Technology Preview
			coreWebVitalsPayload.fcp = roundWithDecimals(metric.value);
			break;
		case 'CLS':
			// Browser support: Chromium,
			coreWebVitalsPayload.cls = roundWithDecimals(metric.value);
			break;
		case 'LCP':
			// Browser support: Chromium
			coreWebVitalsPayload.lcp = roundWithDecimals(metric.value);
			break;
		case 'FID':
			// Browser support: Chromium, Firefox, Safari, Internet Explorer (with the polyfill)
			coreWebVitalsPayload.fid = roundWithDecimals(metric.value);
			break;
		case 'TTFB':
			// Browser support: Chromium, Firefox, Safari, Internet Explorer
			coreWebVitalsPayload.ttfb = roundWithDecimals(metric.value);
			break;
	}
};

type InitCoreWebVitalsOptions = {
	browserId?: string | null;
	pageViewId?: string | null;
	isDev: boolean;
	sampling?: number;
	bypassSampling?: boolean;
};

/**
 * Initialise sending Core Web Vitals metrics to a logging endpoint.
 *
 * @param init - the initialisation options
 * @param init.isDev - used to determine whether to use CODE or PROD endpoints.
 * @param init.browserId - identifies the browser. Usually available via `getCookie('bwid')`.
 * @param init.pageViewId - identifies the page view. Usually available on `guardian.config.page.pageViewId`.
 * @param metricsSentCallback - Optional callback, triggered after metrics are queued for sending
 */
export const initCoreWebVitals = (
	{
		browserId = null,
		pageViewId = null,
		bypassSampling = false,
		sampling = 1 / 100, // 1% of page view by default
		isDev,
	}: InitCoreWebVitalsOptions,
	metricsSentCallback?: (queued?: boolean) => void,
): void => {
	coreWebVitalsPayload.browser_id = browserId;
	coreWebVitalsPayload.page_view_id = pageViewId;

	if (!browserId || !pageViewId)
		console.warn(
			'browserId or pageViewId missing from Core Web Vitals.',
			'Resulting data cannot be joined to page view tables',
			{ browserId, pageViewId },
		);

	if (sampling < 0 || sampling > 1)
		console.warn('Core Web Vitals sampling is outside the 0 to 1 range');
	if (sampling === 0) console.warn('Core Web Vitals are sampled at 0%');
	if (sampling === 1) console.warn('Core Web Vitals are sampled at 100%');

	// By default, sample a percentage of page views
	const pageViewInSample = Math.random() < sampling;
	// Unless we are forcing sending metrics for this page view
	// via initialisation or calling bypassSampling()
	if (bypassSampling || pageViewInSample) shouldSendMetrics = true;
	// Or using a specific hash
	if (window.location.hash === '#bypassSampling') shouldSendMetrics = true;

	getCLS(onReport, false);
	getFID(onReport);
	getLCP(onReport);
	getFCP(onReport);
	getTTFB(onReport);

	// Report all available metrics when the page is backgrounded or unloaded.
	addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') {
			const queued = sendData(isDev);
			if (metricsSentCallback) metricsSentCallback(queued);
		}
	});
	// Safari does not reliably fire the `visibilitychange` on page unload.
	addEventListener('pagehide', () => {
		const queued = sendData(isDev);
		if (metricsSentCallback) metricsSentCallback(queued);
	});
};

export const _ = {
	roundWithDecimals,
	sendData,
	resetShouldForceMetrics: (): void => {
		shouldSendMetrics = false;
	},
};
