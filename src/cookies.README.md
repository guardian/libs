# `cookies`

Robust API over `document.cookie`.

### Usage

```js
import {
    getCookie,
    removeCookie,
    setCookie,
    setSessionCookie
 } from '@guardian/libs';
```

## Methods

-   [`setCookie({name, value, daysToLive, isCrossSubdomain})`](#setCookie)
-   [`setSessionCookie(name, value)`](#setSessionCookie)
-   [`getCookie(name, shouldMemoize)`](#getCookie)
-   [`removeCookie(name)`](#removeCookie)

## `setCookie({name, value, daysToLive?, isCrossSubdomain?})`

Returns: `void`

Sets a cookie taking a name and value, optional daysToLive and optional isCrossSubdomain flag.

#### `name`

Type: `string`

Name of the cookie.

#### `value`

Type: `string`<br>

Value of the cookie.

#### `daysToLive?`

Type: `number`

Days you would like this cookie to live for.

#### `isCrossSubdomain?`

Type: `boolean`<br>

Set this true if the cookie is cross subdomain.

### Example

```js
setCookie({name:'GU_country_code', value:'GB'})
setCookie({name:'GU_country_code', value:'GB', daysToLive: 7})
setCookie({name:'GU_country_code', value:'GB', daysToLive: 7, isCrossSubdomain: true})
```

## `setSessionCookie(name, value)`

Returns: `void`

Sets a session cookie (no expiry date) taking a name and value.

#### `name`

Type: `string`

Name of the cookie.

#### `value`

Type: `string`<br>

Value of the cookie.

### Example

```js
setSessionCookie('GU_country_code', 'GB')
setSessionCookie('GU_country_code', 'GB', true)
```

## `getCookie(name, shouldMemoize?)`

Returns: `cookie` value if it exists or `null`

#### `name`

Type: `string`

Name of the cookie to retrieve.


#### `shouldMemoize?`

Type: `boolean`<br>

When this is set to true it will keep the cookie in memory to avoid fetching more than once.


### Example

```js
getCookie('GU_geo_country'); //GB
```

## `removeCookie(name)`

Returns: `void`

Removes a cookie.

#### `names`

Type: `string`

Name of the stored cookie to remove.

### Example

```js
removeCookie('GU_geo_country');
```
