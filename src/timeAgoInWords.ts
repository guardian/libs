type Options = {
	maxAge?: number;
	format?: FormatType;
	showTime?: boolean;
};

type FormatType = 'short' | 'med' | 'long';
type Unit = 's' | 'm' | 'h' | 'd';

const dayOfWeek = (day: number): string =>
	[
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	][day];

const shortMonth = (month: number): string =>
	[
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	][month];

const pad = (n: number): number | string => n.toString().padStart(2, '0');

const isToday = (date: Date): boolean => {
	const today = new Date();
	return date.toDateString() === today.toDateString();
};

const isWithin24Hours = (date: Date): boolean => {
	const today = new Date();
	return date.valueOf() > today.valueOf() - 24 * 60 * 60 * 1000;
};

const isYesterday = (relative: Date): boolean => {
	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);
	return relative.toDateString() === yesterday.toDateString();
};

const isWithinPastWeek = (date: Date): boolean => {
	const weekAgo = new Date().valueOf() - 7 * 24 * 60 * 60 * 1000;
	return date.valueOf() >= weekAgo;
};

const isValidDate = (date: Date): boolean => {
	if (Object.prototype.toString.call(date) !== '[object Date]') {
		return false;
	}
	return !Number.isNaN(date.getTime());
};

const getSuffix = (type: Unit, format: FormatType, value: number): string => {
	const units = {
		s: {
			short: ['s'],
			med: ['s ago'],
			long: [' second ago', ' seconds ago'],
		},
		m: {
			short: ['m'],
			med: ['m ago'],
			long: [' minute ago', ' minutes ago'],
		},
		h: {
			short: ['h'],
			med: ['h ago'],
			long: [' hour ago', ' hours ago'],
		},
		d: {
			short: ['d'],
			med: ['d ago'],
			long: [' day ago', ' days ago'],
		},
	};

	const strs = units[type][format];
	if (value === 1) {
		return strs[0];
	}
	return strs[strs.length - 1];
};

const withTime = (date: Date): string =>
	` ${date.getHours()}:${pad(date.getMinutes())}`;

export const timeAgoInWords = (
	epoch: number,
	opts: Options = {},
): false | string => {
	const then = new Date(Number(epoch));
	const now = new Date();
	const format = opts.format ?? 'short';
	const extendedFormatting = opts.format === 'short' || opts.format === 'med';

	if (!isValidDate(then)) {
		return false;
	}

	const secondsAgo = Math.floor((now.getTime() - then.getTime()) / 1000);

	if (secondsAgo < 0) {
		// Dates in the future are not supported
		return false;
	} else if (opts.maxAge && secondsAgo > opts.maxAge) {
		// If the event occured after the cutoff (maxAge) bail out
		return false;
	} else if (secondsAgo < 55) {
		// Seconds
		return `${secondsAgo}${getSuffix('s', format, secondsAgo)}`;
	} else if (secondsAgo < 55 * 60) {
		// Minutes
		const minutes = Math.round(secondsAgo / 60);
		return `${minutes}${getSuffix('m', format, minutes)}`;
	} else if (isToday(then) || (extendedFormatting && isWithin24Hours(then))) {
		// Hours
		const hours = Math.round(secondsAgo / 3600);
		return `${hours}${getSuffix('h', format, hours)}`;
	} else if (extendedFormatting && isWithinPastWeek(then)) {
		// Days
		const days = Math.round(secondsAgo / 3600 / 24);
		return `${days}${getSuffix('d', format, days)}`;
	} else if (isYesterday(then)) {
		// Yesterday
		return `Yesterday${withTime(then)}`;
	} else if (secondsAgo < 5 * 24 * 60 * 60) {
		// Less than 5 days (and *not* extendedFormatting)
		return (
			[
				dayOfWeek(then.getDay()),
				then.getDate(),
				shortMonth(then.getMonth()),
				then.getFullYear(),
			].join(' ') + (opts.showTime ? withTime(then) : '')
		);
	}
	return (
		// Default: long description + optional time
		[then.getDate(), shortMonth(then.getMonth()), then.getFullYear()].join(
			' ',
		) + (opts.showTime ? withTime(then) : '')
	);
};
