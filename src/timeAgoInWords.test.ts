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
		expect(timeAgoInWords(secondsAgo)).toBe('30s ago');
	});

	it('returns minutes for slightly recent dates', () => {
		const fiveMinutesAgo = new Date(
			Date.UTC(2019, 10, 17, 11, 55, 0),
		).getTime();
		expect(timeAgoInWords(fiveMinutesAgo)).toBe('5m ago');
	});

	it('returns hours for dates within the last 24 hours', () => {
		const twoHoursAgo = new Date(
			Date.UTC(2019, 10, 17, 10, 0, 0),
		).getTime();
		expect(timeAgoInWords(twoHoursAgo)).toBe('2h ago');
	});

	it('returns days for dates within one week', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 13, 0, 0)).getTime();
		expect(timeAgoInWords(twoDaysAgo)).toBe('2d ago');
	});

	it('returns an absolute date for dates over a week old', () => {
		const eightDaysAgo = new Date(
			Date.UTC(2019, 10, 9, 13, 0, 0),
		).getTime();

		expect(timeAgoInWords(eightDaysAgo)).toBe('9 Nov 2019');
		expect(
			timeAgoInWords(eightDaysAgo, {
				extended: false,
			}),
		).toBe('9 Nov 2019');
		expect(
			timeAgoInWords(eightDaysAgo, {
				extended: true,
			}),
		).toBe('9 Nov 2019');
	});

	it('returns "yesterday" only when extended option given', () => {
		const yesterday = new Date(Date.UTC(2019, 10, 16, 3, 0, 0)).getTime();

		expect(timeAgoInWords(yesterday)).toBe('1d ago');
		expect(timeAgoInWords(yesterday, { extended: true })).toBe(
			'Yesterday 3:00',
		);
	});

	it('does not pluralise the unit when the delta is one', () => {
		const oneSecondAgo = new Date(
			Date.UTC(2019, 10, 17, 11, 59, 59),
		).getTime();
		const oneMinuteAgo = new Date(
			Date.UTC(2019, 10, 17, 11, 59, 0),
		).getTime();
		const oneHourAgo = new Date(Date.UTC(2019, 10, 17, 11, 0, 0)).getTime();
		const oneDayAgo = new Date(Date.UTC(2019, 10, 16, 12, 0, 0)).getTime();

		expect(timeAgoInWords(oneSecondAgo)).toBe('1s ago');
		expect(
			timeAgoInWords(oneSecondAgo, {
				extended: true,
			}),
		).toBe('1 second ago');

		expect(timeAgoInWords(oneHourAgo)).toBe('1h ago');
		expect(
			timeAgoInWords(oneHourAgo, {
				extended: true,
			}),
		).toBe('1 hour ago');

		expect(timeAgoInWords(oneMinuteAgo)).toBe('1m ago');
		expect(
			timeAgoInWords(oneMinuteAgo, {
				extended: true,
			}),
		).toBe('1 minute ago');

		expect(timeAgoInWords(oneDayAgo)).toBe('1d ago');
		expect(
			timeAgoInWords(oneDayAgo, {
				extended: true,
			}),
		).toBe('Yesterday 12:00');
	});

	it('returns extended format for seconds when this option is given', () => {
		const tenSecondsAgo = new Date(
			Date.UTC(2019, 10, 17, 11, 59, 50),
		).getTime();
		expect(
			timeAgoInWords(tenSecondsAgo, {
				extended: true,
			}),
		).toBe('10 seconds ago');
	});

	it('returns extended format for minutes when this option is given', () => {
		const fiveMinutesAgo = new Date(
			Date.UTC(2019, 10, 17, 11, 55, 0),
		).getTime();
		expect(
			timeAgoInWords(fiveMinutesAgo, {
				extended: true,
			}),
		).toBe('5 minutes ago');
	});

	it('returns extended format for hours when this option is given', () => {
		const twoHoursAgo = new Date(
			Date.UTC(2019, 10, 17, 10, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(twoHoursAgo, {
				extended: true,
			}),
		).toBe('2 hours ago');
	});

	it('returns extended format for days when this option is given', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 10, 0, 0)).getTime();
		expect(
			timeAgoInWords(twoDaysAgo, {
				extended: true,
			}),
		).toBe('2 days ago');
	});

	it('still returns a relative string for dates yesterday if within 24hs', () => {
		const twentyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 16, 0, 0),
		).getTime();
		expect(timeAgoInWords(twentyHoursAgo)).toBe('20h ago');
	});

	it('still returns an extended relative string for dates yesterday if within 24hs', () => {
		const twentyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 16, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(twentyHoursAgo, {
				extended: true,
			}),
		).toBe('20 hours ago');
	});

	it('still returns "yesterday" when epoch is the previous day but only if over 24hrs', () => {
		const thirtyHoursAgo = new Date(
			Date.UTC(2019, 10, 16, 6, 0, 0),
		).getTime();
		expect(
			timeAgoInWords(thirtyHoursAgo, {
				extended: true,
			}),
		).toBe('Yesterday 6:00');
	});

	it('returns absolute format dates for dates over one week ago, regardless of options', () => {
		const oneMonthAgo = new Date(Date.UTC(2019, 9, 17, 13, 0, 0)).getTime();
		expect(timeAgoInWords(oneMonthAgo)).toBe('17 Oct 2019');
		expect(timeAgoInWords(oneMonthAgo, { extended: false })).toBe(
			'17 Oct 2019',
		);
		expect(timeAgoInWords(oneMonthAgo, { extended: true })).toBe(
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
		expect(timeAgoInWords(twoDaysAgo)).toBe('2d ago');
		expect(timeAgoInWords(fourDaysAgo)).toBe('4d ago');
		expect(timeAgoInWords(fiveDaysAgo)).toBe('5d ago');
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
