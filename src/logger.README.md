# `logger`

Team-specific production logging API. Messages will be logged to the console
only if the `gu.logger` local storage item contains the team name.

A developer can register to multiple teams by comma-separating them.

## Methods

-   [`log(team, args)`][`log`]
-   [`debug(team, args)`][`debug`]
-   [`window.logger.subscribeTo(team)`](#windowloggersubscribeToteam)
-   [`window.logger.subscribeTo(team)`](#windowloggerunsubscribeFromteam)

### Example

```js
import { log } from '@guardian/libs';
```

## `log(team, args)`

Returns: `void`

Logs a message to the console for a specific team.

#### `team`

Type: `string`<br>

Name of the team interested in this log.

### Example

```js
log('commercial', { 1: true, 2: false });
```

## `debug(team, args)`

Returns: `void`

Identical to [`log`][], but will only run in development environments.

## `window.logger.subscribeTo(team)`

Returns: `void`

Allows a developer to quickly start receiving logs for a specific team.

## `window.logger.unsubscribeFrom(team)`

Returns: `void`

Allows a developer to quickly stop receiving logs for a specific team.

[`log`]: #logteam-args
[`debug`]: #debugteam-args
