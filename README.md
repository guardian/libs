# Libs

> A collection of shared JavaScript libraries for use in Guardian projects

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of contents

- [Installation](#installation)
  - [Bundling](#bundling)
- [Development](#development)
  - [Requirements](#requirements)
  - [Commit messages and releasing to NPM](#commit-messages-and-releasing-to-npm)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

[![Generic badge](https://img.shields.io/badge/google-chat-259082.svg)](https://chat.google.com/room/AAAAWwBdSMs)

```bash
yarn add @guardian/libs
```

or

```bash
npm install @guardian/libs
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

If a commit message follows the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0), semantic-release can determine what types of changes are included in that commit.

If necessary, it will then automatically release a new, [semver](https://semver.org/)-compliant version of the package to NPM.

#### Pull requests

Try to write PR titles in the conventional commit format, and [squash and merge](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-request-merges#squash-and-merge-your-pull-request-commits) when merging. That way your PR will trigger a release when you merge it (if necessary).
