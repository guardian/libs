const memoizedCookies: Map<string, string> = new Map<string, string>();

export const getCookieValues = (name: string) => {
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

// subset of https://github.com/guzzle/guzzle/pull/1131
const isValidCookieValue = (name: string) =>
	!/[()<>@,;"\\/[\]?={} \t]/g.test(name);

const getShortDomain = ({ isCrossSubdomain = false } = {}) => {
	const domain = document.domain || '';

	if (domain === 'localhost' || window.guardian?.config?.page?.isPreview) {
		return domain;
	}

	// Trim any possible subdomain (will be shared with supporter, identity, etc)
	if (isCrossSubdomain) {
		return ['', ...domain.split('.').slice(-2)].join('.');
	}
	// Trim subdomains for prod (www.theguardian), code (m.code.dev-theguardian) and dev (dev.theguardian, m.thegulocal)
	return domain.replace(/^(www|m\.code|dev|m)\./, '.');
};

const getDomainAttribute = ({ isCrossSubdomain = false } = {}) => {
	const shortDomain = getShortDomain({ isCrossSubdomain });
	return shortDomain === 'localhost' ? '' : ` domain=${shortDomain};`;
};

/**
 * Set a cookie. If it's been memoized it won't retrieve it again.
 * @param {string} name - the cookie’s name.
 * @param {string} value - the cookie’s value.
 * @param {number} daysToLive - expiry date will be calculated mased on the daysToLive
 * @param {boolean} isCrossSubdomain - specify if it's a cross subdomain cookie, default false
 */
export const setCookie = (
	name: string,
	value: string,
	daysToLive?: number,
	isCrossSubdomain = false,
): void => {
	const expires = new Date();

	if (!isValidCookieValue(name) || !isValidCookieValue(value)) {
		return;
	}

	if (daysToLive) {
		expires.setDate(expires.getDate() + daysToLive);
	} else {
		expires.setMonth(expires.getMonth() + 5);
		expires.setDate(1);
	}

	document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()};${getDomainAttribute(
		{
			isCrossSubdomain,
		},
	)}`;

	// If the cookie is already memoized we want to replace its value
	if (memoizedCookies.has(name)) {
		memoizedCookies.set(name, getCookieValues(name)[0]);
	}
};

/**
 * Set a session cookieookie. If it's been memoized it won't retrieve it again.
 * @param {string} name - the cookie’s name.
 * @param {string} value - the cookie’s value.
 */
export const setSessionCookie = (name: string, value: string): void => {
	if (!isValidCookieValue(name) || !isValidCookieValue(value)) {
		return;
	}
	document.cookie = `${name}=${value}; path=/;${getDomainAttribute()}`;

	// If the cookie is already memoized we want to replace its value
	if (memoizedCookies.has(name)) {
		memoizedCookies.set(name, getCookieValues(name)[0]);
	}
};

export const removeCookie = (name: string, currentDomainOnly = false): void => {
	const expires = 'expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	const path = 'path=/;';

	// Remove cookie, implicitly using the document's domain.
	document.cookie = `${name}=;${path}${expires}`;
	if (!currentDomainOnly) {
		// also remove from the short domain
		document.cookie = `${name}=;${path}${expires} domain=${getShortDomain()};`;
	}
};

/**
 * Return a cookie. If it's been memoized it won't retrieve it again.
 * @param {string} name - the cookie’s name.
 * @param {boolean} shouldMemoize - set to true if you want to memoize it, default false.
 */
export const getCookie = (
	name: string,
	shouldMemoize = false,
): string | null => {
	if (memoizedCookies.has(name)) {
		return memoizedCookies.get(name) ?? null;
	}

	const cookieVal = getCookieValues(name);

	if (cookieVal.length > 0) {
		if (shouldMemoize) {
			memoizedCookies.set(name, cookieVal[0]);
		}
		return cookieVal[0];
	}
	return null;
};
