import { countries, getCountryByCountryCode } from './index';

describe('The getCountryByCountryCode', () => {
	it('returns a country object', () => {
		expect(getCountryByCountryCode('GB')).toEqual({
			name: 'United Kingdom of Great Britain and Northern Ireland',
			countryCode: 'GB',
		});
	});
});

describe('The countries object', () => {
	it('only contains unique country codes', () => {
		const codes = Object.values(countries).map((c) => c.countryCode);
		expect(codes.length).toBe(new Set(codes).size);
	});

	it('only contains unique country names', () => {
		const names = Object.values(countries).map((c) => c.name);
		expect(names.length).toBe(new Set(names).size);
	});
});
