# `countries`

A list of country codes.

### Usage

```js
import { CountriesByCountryCode } from '@guardian/libs';
import type { CountryCode } from '@guardian/libs';

const logLocation = (country: CountryCode) => {
    console.log('I am in ' + CountriesByCountryCode[country]);
};

logLocation('AU');
```
