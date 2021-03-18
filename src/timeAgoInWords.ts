type Options = {
	format?: Format;
};

type Format = 'short' | 'med' | 'long';
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

const getSuffix = (type: Unit, format: Format, value: number): string => {
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
	const then = new Date(epoch);
	const now = new Date();
	const format = opts.format ?? 'short';

	if (!isValidDate(then)) {
		return false;
	}

	const secondsAgo = Math.floor((now.getTime() - then.getTime()) / 1000);
	const within55Seconds = secondsAgo < 55;
	const withinTheHour = secondsAgo < 55 * 60;
	const within24hrs = isWithin24Hours(then);
	const wasYesterday = isYesterday(then);
	const withinTheWeek = isWithinPastWeek(then);
	const within5Days = secondsAgo < 5 * 24 * 60 * 60;

	if (secondsAgo < 0) {
		// Dates in the future are not supported
		return false;
	} else if (within55Seconds) {
		// Seconds
		return `${secondsAgo}${getSuffix('s', format, secondsAgo)}`;
	} else if (withinTheHour) {
		// Minutes
		const minutes = Math.round(secondsAgo / 60);
		return `${minutes}${getSuffix('m', format, minutes)}`;
	} else if (within24hrs) {
		// Hours
		const hours = Math.round(secondsAgo / 3600);
		return `${hours}${getSuffix('h', format, hours)}`;
	} else if (wasYesterday) {
		// Yesterday
		return `Yesterday${withTime(then)}`;
	} else if (within5Days) {
		// Days
		const days = Math.round(secondsAgo / 3600 / 24);
		return `${days}${getSuffix('d', format, days)}`;
	} else if (withinTheWeek) {
		// Include day of week in string - "Friday 15 Nov 2019 13:00"
		return [
			dayOfWeek(then.getDay()),
			then.getDate(),
			shortMonth(then.getMonth()),
			then.getFullYear(),
		].join(' ');
	}
	return (
		// Simple date - "9 Nov 2019"
		[then.getDate(), shortMonth(then.getMonth()), then.getFullYear()].join(
			' ',
		)
	);
};
