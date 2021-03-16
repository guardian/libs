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

	it('returns "yesterday" correctly', () => {
		const yesterday = new Date(Date.UTC(2019, 10, 16, 13, 0, 0)).getTime();

		expect(timeAgoInWords(yesterday)).toBe('Yesterday 13:00');
	});

	it('returns long format for dates within one week when long option given', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 13, 0, 0)).getTime();
		expect(
			timeAgoInWords(twoDaysAgo, {
				format: 'long',
			}),
		).toBe('Friday 15 Nov 2019');
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

	it('returns a string including time when showTime is true', () => {
		const twoDaysAgo = new Date(Date.UTC(2019, 10, 15, 13, 0, 0)).getTime();
		expect(
			timeAgoInWords(twoDaysAgo, {
				showTime: true,
				format: 'long',
			}),
		).toBe('Friday 15 Nov 2019 13:00');
	});
});
