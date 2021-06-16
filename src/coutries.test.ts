import { Country } from './countries';

it('Country enum contains GB, US & AU', () => {
	expect(Country.GB).toBe(
		'United Kingdom of Great Britain and Northern Ireland',
	);

	expect(Country.US).toBe('United States of America');

	expect(Country.AU).toBe('Australia');
});
