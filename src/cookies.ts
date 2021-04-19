const getCookieValues = (name: string) => {
	const nameEq = `${name}=`;
	const cookies = document.cookie.split(';');

	return cookies.reduce((acc: string[], cookie: string) => {
		const cookieTrimmed: string = cookie.trim();
		if (cookieTrimmed.startsWith(nameEq)) {
			acc.push(
				cookieTrimmed.substring(nameEq.length, cookieTrimmed.length),
			);
		}

		return acc;
	}, []);
};

export const getCookie = (name: string): string | null => {
	const cookieVal = getCookieValues(name);

	if (cookieVal.length > 0) {
		return cookieVal[0];
	}
	return null;
};
