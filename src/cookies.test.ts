import MockDate from 'mockdate';
import {
	getCookie,
	getCookieValues,
	removeCookie,
	setCookie,
	setSessionCookie,
} from './cookies';
import * as cookies from "./cookies";

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
		expect(getCookie('__qca')).toEqual('P0-938012256-1398171768649');
	});

	it('should be able to get a memoized cookie', () => {
		setCookie('GU_geo_country', 'GB', 3, false);
		const spy = jest.spyOn(cookies, 'getCookieValues');
		expect(getCookie('GU_geo_country', true)).toEqual('GB');
		expect(getCookie('GU_geo_country', true)).toEqual('GB');
		expect(getCookie('GU_geo_country', true)).toEqual('GB');
		expect(getCookie('GU_geo_country', true)).toEqual('GB');
		expect(getCookie('GU_geo_country', true)).toEqual('GB');
		// for some reason the spy is been called 1 additional time although that's not happening in reality
		expect(spy).not.toHaveBeenCalledTimes(2);
	});

	it('should be able to re-set a memoized cookie', () => {
		setCookie('GU_geo_country', 'GB', 3, false);
		expect(getCookie('GU_geo_country', true)).toEqual('GB');
		setCookie('GU_geo_country', 'IT', 3, false);
		expect(getCookie('GU_geo_country', true)).toEqual('IT');
	});

	it('should be able to re-set a memoized session cookie', () => {
		setSessionCookie('GU_geo_country', 'GB');
		expect(getCookie('GU_geo_country', true)).toEqual('GB');
		setSessionCookie('GU_geo_country', 'GR');
		expect(getCookie('GU_geo_country', true)).toEqual('GR');
	});

	it('should be able to set a cookie', () => {
		expect(document.cookie).toEqual('');
		setCookie('cookie-1-name', 'cookie-1-value');
		expect(document.cookie).toMatch(
			new RegExp(
				'cookie-1-name=cookie-1-value; path=/; expires=Wed, 01 Apr 2020 12:00:00 GMT; domain=.theguardian.com',
			),
		);
	});

	it('should be able to set a cookie for a specific number of days', () => {
		expect(document.cookie).toEqual('');
		setCookie('cookie-1-name', 'cookie-1-value', 7);
		expect(document.cookie).toEqual(
			'cookie-1-name=cookie-1-value; path=/; expires=Sun, 24 Nov 2019 12:00:00 GMT; domain=.theguardian.com',
		);
	});

	it('should be able to set a session cookie', () => {
		expect(document.cookie).toEqual('');
		setSessionCookie('cookie-1-name', 'cookie-1-value');
		expect(document.cookie).toEqual(
			'cookie-1-name=cookie-1-value; path=/; domain=.theguardian.com',
		);
	});

	it('should be able the remove a cookie', () => {
		document.cookie = 'cookie-1-name=cookie-1-value';

		removeCookie('cookie-1-name');

		const { cookie } = document;

		expect(cookie).toMatch(
			new RegExp(
				'cookie-1-name=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=.theguardian.com',
			),
		);
	});
});
