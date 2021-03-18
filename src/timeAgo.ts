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

const getSuffix = (type: Unit, value: number, extended?: boolean): string => {
	const shouldPluralise = value !== 1;
	switch (type) {
		case 's': {
			if (extended && shouldPluralise) return ' seconds ago';
			if (extended) return ' second ago';
			return 's ago';
		}
		case 'm': {
			if (extended && shouldPluralise) return ' minutes ago';
			if (extended) return ' minute ago';
			return 'm ago';
		}
		case 'h': {
			if (extended && shouldPluralise) return ' hours ago';
			if (extended) return ' hour ago';
			return 'h ago';
		}
		case 'd': {
			if (extended && shouldPluralise) return ' days ago';
			if (extended) return ' day ago';
			return 'd ago';
		}
	}
};

const withTime = (date: Date): string =>
	` ${date.getHours()}:${pad(date.getMinutes())}`;

export const timeAgo = (
	epoch: number,
	options?: {
		extended?: boolean;
	},
): false | string => {
	const then = new Date(epoch);
	const now = new Date();
	const extended = options?.extended;

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
		return `${secondsAgo}${getSuffix('s', secondsAgo, extended)}`;
	} else if (withinTheHour) {
		// Minutes
		const minutes = Math.round(secondsAgo / 60);
		return `${minutes}${getSuffix('m', minutes, extended)}`;
	} else if (within24hrs) {
		// Hours
		const hours = Math.round(secondsAgo / 3600);
		return `${hours}${getSuffix('h', hours, extended)}`;
	} else if (wasYesterday && extended) {
		// Yesterday
		return `Yesterday${withTime(then)}`;
	} else if (within5Days) {
		// Days
		const days = Math.round(secondsAgo / 3600 / 24);
		return `${days}${getSuffix('d', days, extended)}`;
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
