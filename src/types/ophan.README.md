# Ophan

Types related to Ophan.

## Example

```js
import type {
    OphanABEvent,
    OphanABPayload,
    OphanAction,
    OphanComponent,
    OphanComponentEvent,
    OphanComponentType,
    OphanProduct,
    OphanABTestMeta,
} from '@guardian/libs';
```

## `OphanABEvent`

An individual A/B test, structured for Ophan.

## `OphanABPayload`

The payload we send to Ophan: an object of `OphanABEvents` with test IDs as keys.
