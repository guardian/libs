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
};

export const setSessionCookie = (name: string, value: string): void => {
	if (!isValidCookieValue(name) || !isValidCookieValue(value)) {
		return;
	}
	document.cookie = `${name}=${value}; path=/;${getDomainAttribute()}`;
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

export const getCookie = (name: string): string | null => {
	const cookieVal = getCookieValues(name);

	if (cookieVal.length > 0) {
		return cookieVal[0];
	}
	return null;
};
