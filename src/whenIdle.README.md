# `whenIdle()`

Returns: `void`

Runs the given callback when it detects that the browser is idle or if 500ms has passed

## Example

```js
import { whenIdle } from '@guardian/libs';

whenIdle(function () {
    console.log('The browser is idle');
});
```
