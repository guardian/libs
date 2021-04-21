// Based on a suggestion from the typescript-eslint project
// https://github.com/typescript-eslint/typescript-eslint/issues/2118#issuecomment-641464651
export const isObject = (a: unknown): a is Record<string, unknown> =>
	typeof a === 'object' && a !== null;
