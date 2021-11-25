# `whenVisible()`

Returns: `void`

Runs the given callback when it detects that the given element is visible

## Example

```js
import { whenVisible } from '@guardian/libs';

const myElement = document.getElementById('my-element');

whenVisible(myElement, function () {
    console.log('My element is now visible');
});

## Support for older browsers
`IntersectionObserver` is (not supported)[https://caniuse.com/?search=IntersectionObserver] on IE or other older browsers. We check for support and fallback to returning early.
```
