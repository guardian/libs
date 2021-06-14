// the lodash way https://github.com/lodash/lodash/blob/master/isUndefined.js

export const isUndefined = (_: unknown): e is undefined => _ === undefined;
