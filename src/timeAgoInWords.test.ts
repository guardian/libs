import MockDate from 'mockdate';
import { timeAgoInWords } from './timeAgoInWords';

describe('timeAgoInWords', () => {
	beforeAll(() => {
		MockDate.set('Sun Nov 17 2019 12:00:00 GMT+0000 (Greenwich Mean Time)');
	});

	afterAll(() => {
		MockDate.reset();
	});

	it('returns a short date string for older dates', () => {
		const older = new Date(Date.UTC(2019, 1, 1)).getTime();
		expect(timeAgoInWords(older)).toBe('1 Feb 2019');
	});

	it('returns seconds for very recent dates', () => {
		const secondsAgo = new Date(
			Date.UTC(2019, 10, 17, 11, 59, 30),
		).getTime();
		expect(timeAgoInWords(secondsAgo)).toBe('30s');
	});

	it('returns minutes for slightly recent dates', () => {
		const fiveMinutesAgo = new Date(
			Date.UTC(2019, 10, 17, 11, 55, 0),
		).getTime();
		expect(timeAgoInWords(fiveMinutesAgo)).toBe('5m');
	});

	it('returns hours for dates within the last 24 hours', () => {
		const twoHoursAgo = new Date(
			Date.UTC(2019, 10, 17, 10, 0, 0),
		).getTime();
		expect(timeAgoInWords(twoHoursAgo)).toBe('2h');
	});

	it('returns days for dates within one week when short option is passed', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 13, 0, 0)).getTime();
		expect(
			timeAgoInWords(twoDaysAgo, {
				format: 'short',
			}),
		).toBe('2d');
	});

	it('returns days with the "ago" text when med option is passed', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 13, 0, 0)).getTime();

		expect(
			timeAgoInWords(twoDaysAgo, {
				format: 'med',
			}),
		).toBe('2d ago');
	});

	it('returns an absolute date for dates over a week old, regardless of format', () => {
		const eightDaysAgo = new Date(
			Date.UTC(2019, 10, 9, 13, 0, 0),
		).getTime();

		expect(
			timeAgoInWords(eightDaysAgo, {
				format: 'short',
			}),
		).toBe('9 Nov 2019');
		expect(
			timeAgoInWords(eightDaysAgo, {
				format: 'med',
			}),
		).toBe('9 Nov 2019');
		expect(
			timeAgoInWords(eightDaysAgo, {
				format: 'long',
			}),
		).toBe('9 Nov 2019');
	});

	it('returns "yesterday" correctly', () => {
		const yesterday = new Date(Date.UTC(2019, 10, 16, 3, 0, 0)).getTime();

		expect(timeAgoInWords(yesterday)).toBe('Yesterday 3:00');
	});

	it('returns days for dates within one week', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 13, 0, 0)).getTime();
		expect(
			timeAgoInWords(twoDaysAgo, {
				format: 'long',
			}),
		).toBe('2 days ago');
	});

	it('does not pluralise the unit when the delta is one', () => {
		const oneHourAgo = new Date(Date.UTC(2019, 10, 17, 11, 0, 0)).getTime();
		expect(
			timeAgoInWords(oneHourAgo, {
				format: 'short',
			}),
		).toBe('1h');
		expect(
			timeAgoInWords(oneHourAgo, {
				format: 'med',
			}),
		).toBe('1h ago');
		expect(
			timeAgoInWords(oneHourAgo, {
				format: 'long',
			}),
		).toBe('1 hour ago');
	});

	it('only pluralises the unit when format is long', () => {
		const threeHoursAgo = new Date(
			Date.UTC(2019, 10, 17, 9, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(threeHoursAgo, {
				format: 'short',
			}),
		).toBe('3h');
		expect(
			timeAgoInWords(threeHoursAgo, {
				format: 'med',
			}),
		).toBe('3h ago');
		expect(
			timeAgoInWords(threeHoursAgo, {
				format: 'long',
			}),
		).toBe('3 hours ago');
	});

	it('returns a long format relative string for dates within two hours', () => {
		const twoHoursAgo = new Date(
			Date.UTC(2019, 10, 17, 10, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(twoHoursAgo, {
				format: 'long',
			}),
		).toBe('2 hours ago');
	});

	it('still returns a med relative string for dates yesterday if within 24hs', () => {
		const twentyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 16, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(twentyHoursAgo, {
				format: 'med',
			}),
		).toBe('20h ago');
	});

	it('still returns a short relative string for dates yesterday if within 24hs', () => {
		const twentyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 16, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(twentyHoursAgo, {
				format: 'short',
			}),
		).toBe('20h');
	});

	it('returns hours for dates within 24hs', () => {
		const twentyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 16, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(twentyHoursAgo, {
				format: 'long',
			}),
		).toBe('20 hours ago');
	});

	it('still returns "yesterday" for dates over 24hrs if format long and is yesterday', () => {
		const thirtyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 6, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(thirtyHoursAgo, {
				format: 'long',
			}),
		).toBe('Yesterday 6:00');
	});

	it('uses "Yesterday" for dates over 24hrs', () => {
		const thirtyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 6, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(thirtyHoursAgo, {
				format: 'med',
			}),
		).toBe('Yesterday 6:00');
	});

	it('returns short format dates for dates over one week ago, regardless of options', () => {
		const oneMonthAgo = new Date(Date.UTC(2019, 9, 17, 13, 0, 0)).getTime();
		expect(timeAgoInWords(oneMonthAgo)).toBe('17 Oct 2019');
		expect(timeAgoInWords(oneMonthAgo, { format: 'med' })).toBe(
			'17 Oct 2019',
		);
		expect(timeAgoInWords(oneMonthAgo, { format: 'long' })).toBe(
			'17 Oct 2019',
		);
	});

	it('returns days when within 5 days', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 13, 0, 0)).getTime();
		const fourDaysAgo = new Date(
			Date.UTC(2019, 10, 13, 13, 0, 0),
		).getTime();
		const fiveDaysAgo = new Date(
			Date.UTC(2019, 10, 12, 13, 0, 0),
		).getTime();
		expect(timeAgoInWords(twoDaysAgo)).toBe('2d');
		expect(timeAgoInWords(fourDaysAgo)).toBe('4d');
		expect(timeAgoInWords(fiveDaysAgo)).toBe('5d');
	});

	it('includes day of week when within the week', () => {
		const sixDaysAgo = new Date(Date.UTC(2019, 10, 11, 13, 0, 0)).getTime();
		expect(timeAgoInWords(sixDaysAgo)).toBe('Monday 11 Nov 2019');
	});

	it('defaults to a simple date format for dates over 1 week old', () => {
		const eightDaysAgo = new Date(
			Date.UTC(2019, 10, 9, 13, 0, 0),
		).getTime();
		const aWhileBack = new Date(Date.UTC(2017, 3, 2, 17, 0, 0)).getTime();
		expect(timeAgoInWords(eightDaysAgo)).toBe('9 Nov 2019');
		expect(timeAgoInWords(aWhileBack)).toBe('2 Apr 2017');
	});
});
