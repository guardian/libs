# `@guardian/libs`

[![npm (scoped)](https://img.shields.io/npm/v/@guardian/libs)](https://www.npmjs.com/package/@guardian/libs)
[![ES version](https://badgen.net/badge/ES/2020/cyan)](https://tc39.es/ecma262/2020/)
[![npm type definitions](https://img.shields.io/npm/types/@guardian/libs)](https://www.typescriptlang.org/)
[![Coverage Status](https://coveralls.io/repos/github/guardian/libs/badge.svg)](https://coveralls.io/github/guardian/libs)
[![gzip size](https://img.badgesize.io/https://unpkg.com/@guardian/libs/dist/umd/index.min.js?compression=gzip)](https://unpkg.com/@guardian/libs/dist/umd/index.min.js)

> A collection of JavaScript libraries for Guardian projects

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Libs](#libs)
  - [`getLocale`](#getlocale)
  - [`isString`](#isstring)
  - [`isUndefined`](#isundefined)
  - [`loadScript`](#loadscript)
  - [`log`/`debug`](#logdebug)
  - [`storage`](#storage)
- [Installation](#installation)
  - [Bundling](#bundling)
- [Development](#development)
  - [Requirements](#requirements)
  - [Releasing](#releasing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Libs

The following modules are available:

### [`getLocale`](./src/getLocale.README.md)

Get the user’s current location.

### [`isString`](./src/isString.README.md)

Check whether a value is a string.

### [`isUndefined`](./src/isUndefined.README.md)

Check whether a value is `undefined`.

### [`loadScript`](./src/loadScript.README.md)

Inject an external JavaScript file.

### [`log`/`debug`](./src/logger.README.md)

Selectively log team-specific messages to the console.

### [`storage`](./src/storage.README.md)

Robust API over `localStorage` and `sessionStorage`.

## Installation

[![Generic badge](https://img.shields.io/badge/google-chat-259082.svg)](https://chat.google.com/room/AAAAWwBdSMs)

```bash
yarn add @guardian/libs
```

or

```bash
npm install @guardian/libs
```

then

```js
import { loadScript, storage, ...etc } from '@guardian/libs';
```

or

```html
<script src="https://unpkg.com/@guardian/libs"></script>
<script>
    // window.gu.libs = { loadScript, storage, ...etc }
</script>
```

### Bundling

This package uses `ES2020`.

If your target environment does not support that, make sure you transpile this package when bundling your application.

## Development

### Requirements

1. [Node LTS (latest)](https://nodejs.org/en/download/) ([nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) recommended)
2. [Yarn](https://classic.yarnpkg.com/en/docs/install/)

### Releasing

Changes are automatically released to NPM.

The `main` branch on GitHub is analysed by [semantic-release](https://semantic-release.gitbook.io/) after every push.

If a commit message follows the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0), semantic-release can determine what Types of changes are included in that commit.

If necessary, it will then automatically release a new, [semver](https://semver.org/)-compliant version of the package to NPM.

#### Pull requests

Try to write PR titles in the conventional commit format, and [squash and merge](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-request-merges#squash-and-merge-your-pull-request-commits) when merging. That way your PR will trigger a release when you merge it (if necessary).
