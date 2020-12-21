# `isContrastFriendly()`

Returns: `{ AA: boolean, AAA: boolean }`

Compares foreground and background colours and returns if these meet [`AA` and `AAA` WebAIM guidelines](https://webaim.org/resources/contrastchecker/).

## Example

```typescript
import { isContrastFriendly } from '@guardian/libs';

const blackHex = '#000000';

isContrastFriendly(blackHex, 'seagreen'); // {AA: true, AAA: false}
isContrastFriendly(blackHex, 'lightseagreen'); // {AA: true, AAA: true}

// invalid hexadecimal colours or named colours return false
isContrastFriendly(blackHex, 'foo bar'); // {AA: false, AAA: false}
```
