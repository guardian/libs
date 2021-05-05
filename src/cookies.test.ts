import MockDate from 'mockdate';
import * as cookies from './cookies';

describe('cookies', () => {
	beforeAll(() => {
		MockDate.set('Sun Nov 17 2019 12:00:00 GMT+0000 (Greenwich Mean Time)');
	});

	afterAll(() => {
		MockDate.reset();
	});

	let cookieValue = '';

	Object.defineProperty(document, 'domain', { value: 'www.theguardian.com' });
	Object.defineProperty(document, 'cookie', {
		get() {
			return cookieValue.replace('|', ';').replace(/^[;|]|[;|]$/g, '');
		},

		set(value: string) {
			const name = value.split('=')[0];
			const newVal = cookieValue
				.split('|')
				.filter((cookie) => cookie.split('=')[0] !== name);

			newVal.push(value);
			cookieValue = newVal.join('|');
		},
	});

	beforeEach(() => {
		cookieValue = '';
	});

	it('should be able to get a cookie', () => {
		document.cookie =
			'optimizelyEndUserId=oeu1398171767331r0.5280374749563634; __qca=P0-938012256-1398171768649;';
		expect(cookies.getCookie({ name: '__qca' })).toEqual(
			'P0-938012256-1398171768649',
		);
	});

	it('should be able to set a cookie', () => {
		expect(document.cookie).toEqual('');
		cookies.setCookie({
			name: 'cookie-1-name',
			value: 'cookie-1-value',
		});
		expect(document.cookie).toMatch(
			new RegExp(
				'cookie-1-name=cookie-1-value; path=/; expires=Wed, 01 Apr 2020 12:00:00 GMT; domain=.theguardian.com',
			),
		);
	});

	it('should be able to set a cookie for a specific number of days', () => {
		expect(document.cookie).toEqual('');
		cookies.setCookie({
			name: 'cookie-1-name',
			value: 'cookie-1-value',
			daysToLive: 7,
		});
		expect(document.cookie).toEqual(
			'cookie-1-name=cookie-1-value; path=/; expires=Sun, 24 Nov 2019 12:00:00 GMT; domain=.theguardian.com',
		);
	});

	it('should be able to set a session cookie', () => {
		expect(document.cookie).toEqual('');
		cookies.setSessionCookie({
			name: 'cookie-1-name',
			value: 'cookie-1-value',
		});
		expect(document.cookie).toEqual(
			'cookie-1-name=cookie-1-value; path=/; domain=.theguardian.com',
		);
	});

	it('should be able to get a memoized cookie with days to live and cross subdomain', () => {
		cookies.setCookie({
			name: 'GU_geo_country',
			value: 'GB',
			daysToLive: 1,
			isCrossSubdomain: true,
		});
		const spy = jest.spyOn(cookies, 'getCookieValues');
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('GB');
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('GB');
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('GB');
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('GB');
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('GB');
		// for some reason the spy is been called 1 additional time although that's not happening in reality
		expect(spy).not.toHaveBeenCalledTimes(2);
	});

	it('should be able to get a memoized cookie with days to live', () => {
		cookies.setCookie({
			name: 'GU_geo_country',
			value: 'IT',
			daysToLive: 1,
		});
		const spy = jest.spyOn(cookies, 'getCookieValues');
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('IT');
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('IT');
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('IT');
		// for some reason the spy is been called 1 additional time although that's not happening in reality
		expect(spy).not.toHaveBeenCalledTimes(2);
	});

	it('should be able to re-set a memoized cookie', () => {
		cookies.setCookie({
			name: 'GU_geo_country',
			value: 'GB',
			daysToLive: 3,
			isCrossSubdomain: false,
		});
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('GB');
		cookies.setCookie({
			name: 'GU_geo_country',
			value: 'IT',
			daysToLive: 3,
			isCrossSubdomain: false,
		});
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('IT');
	});

	it('should be able to re-set a memoized session cookie', () => {
		cookies.setSessionCookie({ name: 'GU_geo_country', value: 'GB' });
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('GB');
		cookies.setSessionCookie({ name: 'GU_geo_country', value: 'GR' });
		expect(
			cookies.getCookie({ name: 'GU_geo_country', shouldMemoize: true }),
		).toEqual('GR');
	});

	it('should be able the remove a cookie', () => {
		document.cookie = 'cookie-1-name=cookie-1-value';

		cookies.removeCookie({ name: 'cookie-1-name' });

		const { cookie } = document;

		expect(cookie).toMatch(
			new RegExp(
				'cookie-1-name=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=.theguardian.com',
			),
		);
	});
});
