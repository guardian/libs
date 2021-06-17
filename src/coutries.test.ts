import { CountriesByCountryCode } from './countries';

it('Country enum contains GB, US & AU', () => {
	expect(CountriesByCountryCode.GB).toBe(
		'United Kingdom of Great Britain and Northern Ireland',
	);

	expect(CountriesByCountryCode.US).toBe('United States of America');

	expect(CountriesByCountryCode.AU).toBe('Australia');
});
