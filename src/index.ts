/* istanbul ignore file */

export {
	getCookie,
	removeCookie,
	setCookie,
	setSessionCookie,
} from './cookies';
export { getLocale } from './getLocale';
export { getSwitches } from './getSwitches';
export { isBoolean } from './isBoolean';
export { isObject } from './isObject';
export { isString } from './isString';
export { isUndefined } from './isUndefined';
export { loadScript } from './loadScript';
export { debug, log } from './logger';
export { storage } from './storage';
export { timeAgo } from './timeAgo';
export type {
	OphanABEvent,
	OphanABPayload,
	OphanAction,
	OphanComponent,
	OphanComponentEvent,
	OphanComponentType,
	OphanProduct,
	TestMeta,
} from './types/ophan';
export type { Switches } from './types/switches';
