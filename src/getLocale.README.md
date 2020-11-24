# `getLocale()`

Returns: `Promise<string | null>`

Fetches the user's current location as an [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Decoding_table) string e.g. `'GB'`, `'AU'` etc.

## Example

```js
import { getLocale } from '@guardian/libs';

getLocale().then((locale) => {
    console.log(locale); // UK, AU etc
});
```
