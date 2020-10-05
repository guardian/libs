export const loadScript = (
	src: string,
	props?: Omit<Partial<HTMLScriptElement>, 'src' | 'onload' | ' onerror'>,
): Promise<Event | undefined> =>
	new Promise((resolve, reject) => {
		// creating this before the check below allows us to compare the resolved `src` values
		const script = document.createElement('script');
		script.src = src;

		// dont inject 2 scripts with the same src
		if (Array.from(document.scripts).some(({ src }) => script.src === src)) {
			return resolve();
		}

		Object.assign(script, props);

		script.onload = resolve;
		script.onerror = () => {
			reject(new Error(`Failed to load script ${src}`));
		};

		const ref = document.scripts[0];
		ref?.parentNode?.insertBefore(script, ref);
	});
