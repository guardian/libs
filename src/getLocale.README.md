<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [`getLocale()`](#getlocale)
  - [Example](#example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
