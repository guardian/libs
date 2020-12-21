# `isContrastFriendly()`

Returns: `{ AA: boolean, AAA: boolean }`

Compares foreground and background colours and returns if these meet [`AA` and `AAA` WebAIM guidelines](https://webaim.org/resources/contrastchecker/).

## Example

```typescript
import { isContrastFriendly } from '@guardian/libs';

const mediumConstrat = ['#000', 'seagreen']; // shorthand hex is supported
const highContrast = ['#000000', 'lightseagreen'];

isContrastFriendly(...mediumContrast); // {AA: true, AAA: false}
isContrastFriendly(...highContrast); // {AA: true, AAA: true}

// invalid hexadecimal colours or named colours return false
isContrastFriendly(blackHex, 'foo bar'); // {AA: false, AAA: false}
```
