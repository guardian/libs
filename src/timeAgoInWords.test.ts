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
				length: 'short',
			}),
		).toBe('2d');
	});

	it('returns days with the "ago" text when med option is passed', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 13, 0, 0)).getTime();

		expect(
			timeAgoInWords(twoDaysAgo, {
				length: 'med',
			}),
		).toBe('2d ago');
	});

	it('returns an absolute date for dates over a week old, regardless of length', () => {
		const eightDaysAgo = new Date(
			Date.UTC(2019, 10, 9, 13, 0, 0),
		).getTime();

		expect(
			timeAgoInWords(eightDaysAgo, {
				length: 'short',
			}),
		).toBe('9 Nov 2019');
		expect(
			timeAgoInWords(eightDaysAgo, {
				length: 'med',
			}),
		).toBe('9 Nov 2019');
		expect(
			timeAgoInWords(eightDaysAgo, {
				length: 'long',
			}),
		).toBe('9 Nov 2019');
	});

	it('returns "yesterday" correctly', () => {
		const yesterday = new Date(Date.UTC(2019, 10, 16, 13, 0, 0)).getTime();

		expect(timeAgoInWords(yesterday)).toBe('Yesterday 13:00');
	});

	it('returns long length for dates within one week when long option given', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 13, 0, 0)).getTime();
		expect(
			timeAgoInWords(twoDaysAgo, {
				length: 'long',
			}),
		).toBe('Friday 15 Nov 2019');
	});

	it('does not pluralise the unit when the delta is one', () => {
		const oneHourAgo = new Date(Date.UTC(2019, 10, 17, 11, 0, 0)).getTime();
		expect(
			timeAgoInWords(oneHourAgo, {
				length: 'short',
			}),
		).toBe('1h');
		expect(
			timeAgoInWords(oneHourAgo, {
				length: 'med',
			}),
		).toBe('1h ago');
		expect(
			timeAgoInWords(oneHourAgo, {
				length: 'long',
			}),
		).toBe('1 hour ago');
	});

	it('only pluralises the unit when length is long', () => {
		const threeHoursAgo = new Date(
			Date.UTC(2019, 10, 17, 9, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(threeHoursAgo, {
				length: 'short',
			}),
		).toBe('3h');
		expect(
			timeAgoInWords(threeHoursAgo, {
				length: 'med',
			}),
		).toBe('3h ago');
		expect(
			timeAgoInWords(threeHoursAgo, {
				length: 'long',
			}),
		).toBe('3 hours ago');
	});

	it('returns a long length relative string for dates within two hours', () => {
		const twoHoursAgo = new Date(
			Date.UTC(2019, 10, 17, 10, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(twoHoursAgo, {
				length: 'long',
			}),
		).toBe('2 hours ago');
	});

	it('still returns a med relative string for dates yesterday if within 24hs', () => {
		const twentyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 16, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(twentyHoursAgo, {
				length: 'med',
			}),
		).toBe('20h ago');
	});

	it('still returns a short relative string for dates yesterday if within 24hs', () => {
		const twentyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 16, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(twentyHoursAgo, {
				length: 'short',
			}),
		).toBe('20h');
	});

	it('returns "yesterday" for dates within 24hs if length long', () => {
		const twentyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 16, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(twentyHoursAgo, {
				length: 'long',
			}),
		).toBe('Yesterday 16:00');
	});

	it('still returns "yesterday" for dates over 24hrs if length long and is yesterday', () => {
		const thirtyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 6, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(thirtyHoursAgo, {
				length: 'long',
			}),
		).toBe('Yesterday 6:00');
	});

	it('uses 1d, not "Yesterday" for dates over 24hrs if length med', () => {
		const thirtyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 6, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(thirtyHoursAgo, {
				length: 'med',
			}),
		).toBe('1d ago');
	});

	it('returns short length dates for dates over one week ago, regardless of options', () => {
		const oneMonthAgo = new Date(Date.UTC(2019, 9, 17, 13, 0, 0)).getTime();
		expect(timeAgoInWords(oneMonthAgo)).toBe('17 Oct 2019');
		expect(timeAgoInWords(oneMonthAgo, { length: 'med' })).toBe(
			'17 Oct 2019',
		);
		expect(timeAgoInWords(oneMonthAgo, { length: 'long' })).toBe(
			'17 Oct 2019',
		);
	});

	it('returns a string including time when showTime is true', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 13, 0, 0)).getTime();
		expect(
			timeAgoInWords(twoDaysAgo, {
				showTime: true,
				length: 'long',
			}),
		).toBe('Friday 15 Nov 2019 13:00');
	});
});
