# `cookies`

Robust API over `document.cookie`.

### Example

```js
import { cookies } from '@guardian/libs';

```

## Methods

-   [`setSessionCookie(name, value)`](#setSessionCookie)
-   [`getCookie(name)`](#getCookie)
-   [`cleanUp(names)`](#cleanUp)

## `setSessionCookie`

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
```

## `getCookie`

Returns: `cookie` value if it exists or `null`

#### `name`

Type: `string`

Name of the cookie to retrieve.


### Example

```js
getCookie('GU_geo_country'); //GB
```

## `cleanUp`

Returns: `void`

Removes a list of cookies.

#### `[names]`

Type: `string[]`

Names of the stored cookies to remove.

### Example

```js
cleanUp('GU_geo_country');
```
