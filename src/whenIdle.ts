/**
 * whenIdle executes the given callback when the browser is 'idle'
 *
 * @param callback Fired when requestIdleCallback runs or, if requestIdleCallback is not available, after 300ms
 * @param options Options for requestIdleCallback
 * @param options.timeout How long to wait for requestIdleCallback to return, defaults to 500ms
 */
export const whenIdle = (
	callback: () => void,
	options: {
		timeout: number;
	} = {
		timeout: 500,
	},
): void => {
	if ('requestIdleCallback' in window) {
		window.requestIdleCallback(callback, options);
	} else {
		setTimeout(callback, 300);
	}
};
