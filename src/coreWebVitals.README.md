# Core Web Vitals

Reports on Core Web Vitals using Google’s [`web-vitals`] library, and send the
metrics to an logging endpoint when the user leaves the page.

By default, only 1% of page views will the data, but it’s possible to force this
behaviour at initialisation or asynchronously.

[`web-vitals`]: https://github.com/GoogleChrome/web-vitals

## Usage

```js
import { initCoreWebVitals } from '@guardian/libs';

const optionalCallback = () => {
    // An optional callback which triggers when the user leaves the page
    log('dotcom', 'CWV payload queued for async request')
}

initCoreWebVitals({
    browserId,
    pageViewId,
    isDev, // will decide whether to use PROD or CODE enpoints
}, optionalCallback)
```

### `init.forceSendMetrics`

Allows to set at initialisation whether metrics should be sent
for this page view.

```ts
const init = {
    browserId: 'abc',
    pageViewId: '123',
    isDev: false,
    forceSendMetrics: isInSeverSideTest(),
}

initCoreWebVitals(init)
```

### `forceSendMetrics`

Allows to set after initialisation whether metrics should be sent
for this page view.

```ts
/* … after having called initCoreWebVitals() … */

addEventListener('some-event-which-should track pageviews', () => {
    forceSendMetrics(); // metrics will be sent when the user leaves the page
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
