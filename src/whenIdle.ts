/**
 * whenIdle executes the given callback when the browser is 'idle'
 *
 * @param callback Fired when requestIdleCallback runs or, if requestIdleCallback is not available, after 300ms
 */
export const whenIdle = (callback: () => void): void => {
	if ('requestIdleCallback' in window) {
		window.requestIdleCallback(callback, { timeout: 500 });
	} else {
		setTimeout(callback, 300);
	}
};
