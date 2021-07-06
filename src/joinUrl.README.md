# `joinUrl()`

Returns: `string`

Takes an array of url parts, joining them as a single valid url. Handles trailing or leading spaces and double slashes.

## Example

```js
import { joinUrl } from '@guardian/libs';

const url = joinUrl(['http://example.com/ ', ' /abc/', '/xyz/']);
// 'http://example.com/abc/xyz'
```
