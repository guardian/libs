import type { ReportHandler } from 'web-vitals';
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';
import { log } from './index';

type CoreWebVitalsPayload = {
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

// By default, sample 1% of page views
const userInSample = Math.random() < 1 / 100;

let shouldSendMetrics = window.location.hash === '#forceSendMetrics';
// unless we are forcing sending metrics for this page view
// via initialisation or calling forceSendMetrics()
export const forceSendMetrics = (): void => {
	shouldSendMetrics = true;
};

const roundWithDecimals = (value: number, precision = 6) => {
	const power = Math.pow(10, precision);
	return Math.round(value * power) / power;
};

const sendData = () => {
	if (
		!(userInSample || shouldSendMetrics) ||
		coreWebVitalsPayload.fcp === null
	) {
		log('dotcom', 'Won’t send Core Web Vitals', {
			userInSample,
			shouldSendMetrics,
			fcp: coreWebVitalsPayload.fcp,
		});
		return false;
	}

	log('dotcom', 'About to send Core Web Vitals', coreWebVitalsPayload);

	const endpoint =
		window.location.hostname === 'm.code.dev-theguardian.com' ||
		window.location.hostname === 'localhost' ||
		window.location.hostname === 'preview.gutools.co.uk'
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

export const coreWebVitals = (
	{
		browserId,
		pageViewId,
		forceSendMetrics = false,
	}: {
		browserId: string;
		pageViewId: string;
		forceSendMetrics: boolean;
	},
	metricsSentCallback: (queued?: boolean) => void = () => void 0,
): void => {
	coreWebVitalsPayload.browser_id = browserId;
	coreWebVitalsPayload.page_view_id = pageViewId;

	if (forceSendMetrics) shouldSendMetrics = true;

	getCLS(onReport, false);
	getFID(onReport);
	getLCP(onReport);
	getFCP(onReport);
	getTTFB(onReport);

	// Report all available metrics when the page is backgrounded or unloaded.
	addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') {
			const queued = sendData();
			metricsSentCallback(queued);
		}
	});
	// Safari does not reliably fire the `visibilitychange` on page unload.
	addEventListener('pagehide', () => {
		const queued = sendData();
		metricsSentCallback(queued);
	});
};
