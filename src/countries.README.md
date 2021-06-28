# `countries`

A list of country codes.

## Usage

```js
import { countries, getCountryByCountryCode } from '@guardian/libs';
import type { Country, CountryCode, CountryKey } from '@guardian/libs';

const logLocation = (country: CountryCode) => {
    console.log('I am in ' + getCountryByCountryCode[country]);
};

logLocation('AU');

console.log(countries.united_kingdom.name); // United Kingdom of Great Britain and Northern Ireland
```
