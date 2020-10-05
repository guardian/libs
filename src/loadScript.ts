export const loadScript = (
	src: string,
	props?: Omit<Partial<HTMLScriptElement>, 'src' | 'onload' | ' onerror'>,
): Promise<Event | undefined> =>
	new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) {
			return resolve();
		}

		const script = document.createElement('script');

		Object.assign(script, props);

		script.src = src;
		script.onload = resolve;
		script.onerror = () => {
			reject(new Error(`Failed to load script ${src}`));
		};

		const ref = document.scripts[0];
		ref?.parentNode?.insertBefore(script, ref);
	});
