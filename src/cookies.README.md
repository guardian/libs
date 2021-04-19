# `getCookie(name)`

Returns: `string` or `null`

Returns the content of a cookie or `null` if the cookie does not exist.

## Example

```js
import { getCookie } from '@guardian/libs';

getCookie('GU_geo_country'); // 'GB'
```
