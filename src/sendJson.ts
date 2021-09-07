export const sendJson = (url: string, data: Record<string, unknown>): void => {
	const body = JSON.stringify(data);

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- support isn’t 100%
	navigator.sendBeacon
		? navigator.sendBeacon(url, body)
		: void fetch(url, {
				method: 'POST',
				body,
				keepalive: true,
		  });
};
