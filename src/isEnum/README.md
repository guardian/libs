# `isEnum(object)`

Returns: `boolean`

Checks whether `object` has unique keys and values (i.e. `enum`-like).

## Example

```js
import { isEnum } from '@guardian/libs';

isEnum({ a: 1, b: 2 }); // true
isEnum({ a: 0, b: 0 }); // false
```
