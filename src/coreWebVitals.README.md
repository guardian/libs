# Core Web Vitals

Reports on Core Web Vitals using Google’s [`web-vitals`] library, and send the
metrics to an logging endpoint when the user leaves the page.

By default, a sampling rate is set at 1% for which the data will be sent,
but it’s possible to set and bypass this sampling, either at initialisation
or asynchronously.

[`web-vitals`]: https://github.com/GoogleChrome/web-vitals

## Usage

```js
import { initCoreWebVitals } from '@guardian/libs';

const optionalCallback = (queued) => {
    // An optional callback which triggers when the user leaves the page
    log('dotcom', `CWV payload ${queued ? 'queued' : 'not queued'} for async request`)
}

// browserId & pageViewId are needed to join up the data downstream.
const init: InitCoreWebVitalsOptions = {
    browserId : getCookie('bwid'),
    pageViewId: guardian.ophan.pageViewId,

    // Whether to use CODE or PROD endpoints.
    isDev: window.location.hostname !== 'www.theguardian.com',
}

initCoreWebVitals(init, optionalCallback)
```

### `init.sampling`

Sets a sampling rate for which to send data to the logging endpoint.

Defaults to `0.01` (1%).

```ts
const init: InitCoreWebVitalsOptions = {
    isDev: false,

    // Send data for 20% of page views. Inform Data Tech team about expected
    // spikes in data ingestion
    sampling: 20 / 100,
}

initCoreWebVitals(init)
```

### `init.bypassSampling`

Allows to set at initialisation whether to bypass the sampling rate.
If `true`, this is equivalent for setting the sampling to 100%.
Typical use case is checking whether a page view is part of an experiment.

Defaults to `false`.

```ts
const init: InitCoreWebVitalsOptions = {
    isDev: false,

    // capture metrics for all page views in experiment group
    bypassSampling: isInExperiment(),
}

initCoreWebVitals(init)
```

### `bypassSampling`

Allows to asynchronously bypass the sampling rate.

```ts
/* … after having called initCoreWebVitals() … */

addEventListener('some-event', () => {
    // Metrics will be sent for all page views where `some-event` was triggered
    bypassSampling();
})
```


## Types

### `CoreWebVitalsPayload`

```ts
type CoreWebVitalsPayload = {
	page_view_id: string | null;
	browser_id: string | null;
	fid: null | number;
	cls: null | number;
	lcp: null | number;
	fcp: null | number;
	ttfb: null | number;
};
```

### `InitCoreWebVitalsOptions`

```ts
type InitCoreWebVitalsOptions = {
	isDev: boolean;

	browserId?: string | null;
	pageViewId?: string | null;

	sampling?: number;
	bypassSampling?: boolean;
};
```
