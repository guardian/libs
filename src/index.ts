/* istanbul ignore file */

export { getLocale } from './getLocale';
export { isString } from './isString';
export { isUndefined } from './isUndefined';
export { loadScript } from './loadScript';
export { OptionKind,
	some,
	none,
	fromNullable,
	withDefault,
	map,
	map2,
	andThen, } from './option';
export { 	ResultKind,
	ok,
	err,
	fromUnsafe,
	partition,
	either,
	mapError,
	toOption,
	map as resultMap,
	andThen as resultAndThen, } from './result';
export { storage } from './storage';
export { timeAgo } from './timeAgo';
export {
	getCookie,
	removeCookie,
	setCookie,
	setSessionCookie,
} from './cookies';
export { log, debug } from './logger';
