<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [`storage.local` / `storage.session`](#storagelocal--storagesession)
    - [Example](#example)
  - [`get(key)`](#getkey)
    - [Example](#example-1)
  - [`set(key, value, expires?)`](#setkey-value-expires)
    - [Example](#example-2)
  - [`remove(key)`](#removekey)
    - [Example](#example-3)
  - [`clear()`](#clear)
    - [Example](#example-4)
  - [`isAvailable()`](#isavailable)
    - [Example](#example-5)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# `storage.local` / `storage.session`

API over `localStorage` and `sessionStorage`.

### Example

```js
import { storage } from '@guardian/libs';

// the following are now available:
// - storage.local
// - storage.session
```

Has a few advantages over the native API:

-   fails gracefully if storage is not available
-   you can save and retrieve any JSONable data
-   stored items can expire

_n.b. the examples below use `storage.local`, but all methods are available for both `storage.local` and `storage.session`._

## `get(key)`

Returns: `string` | `number` | `boolean` | `null` | `object` | `array`

Retrieves an item from storage.

#### `key`

Type: `string`<br>

Name of the stored item.

### Example

```js
storage.local.get('my-item');
```

## `set(key, value, expires?)`

Returns: `void`

Saves a value to storage.

#### `key`

Type: `string`

Name of the item to store the value in.

#### `value`

Type: `string` | `number` | `boolean` | `null` | `object` | `array`

The value to store.

#### `expires?`

Type: `string` | `number` | `Date`

Optional expiry date for this item.

### Example

```js
storage.local.set('my-item', {
    prop1: 'abc',
    prop2: 123,
});

storage.local.set(
    'my-expiring-item',
    {
        prop1: 'abc',
        prop2: 123,
    },
    // expires 24 hours from now
    Date.now() + 60 * 60 * 24 * 1000,
);
```

## `remove(key)`

Returns: `void`

Removes an item from storage.

#### `key`

Type: `string`

Name of the stored item to remove.

### Example

```js
storage.local.remove('my-item');
```

## `clear()`

Returns: `void`

Removes all items from storage.

### Example

```js
storage.local.clear();
```

## `isAvailable()`

Returns: `boolean`

Check whether the storage type is available.

### Example

```js
storage.local.isAvailable(); // true or false
```
