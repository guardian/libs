type Unit = 's' | 'm' | 'h' | 'd';

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

const longMonth = (month: number): string =>
	[
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
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

const getSuffix = (type: Unit, value: number, verbose?: boolean): string => {
	const shouldPluralise = value !== 1;
	switch (type) {
		case 's': {
			// Always pluralised, as less than 15 seconds returns “now”
			if (verbose) return ' seconds ago';
			return 's ago';
		}
		case 'm': {
			if (verbose && shouldPluralise) return ' minutes ago';
			if (verbose) return ' minute ago';
			return 'm ago';
		}
		case 'h': {
			if (verbose && shouldPluralise) return ' hours ago';
			if (verbose) return ' hour ago';
			return 'h ago';
		}
		case 'd': {
			// Always pluralised, as less than 2 days returns “Yesterday HH.MM”
			if (verbose) return ' days ago';
			return 'd ago';
		}
	}
};

const withTime = (date: Date): string =>
	` ${date.getHours()}.${pad(date.getMinutes())}`;

export const timeAgo = (
	epoch: number,
	options?: {
		verbose?: boolean;
		daysUntilAbsolute?: number;
	},
): false | string => {
	const then = new Date(epoch);
	const now = new Date();

	const verbose = options?.verbose;
	const daysUntilAbsolute = options?.daysUntilAbsolute ?? 7;

	const secondsAgo = Math.floor((now.getTime() - then.getTime()) / 1000);
	const veryClose = secondsAgo < 15;
	const within55Seconds = secondsAgo < 55;
	const withinTheHour = secondsAgo < 55 * 60;
	const within24hrs = isWithin24Hours(then);
	const wasYesterday = isYesterday(then);
	const withinAbsoluteCutoff = secondsAgo < daysUntilAbsolute * 24 * 60 * 60;

	if (secondsAgo < 0) {
		// Dates in the future are not supported
		return false;
	} else if (veryClose) {
		// Now
		return 'now';
	} else if (within55Seconds) {
		// Seconds
		return `${secondsAgo}${getSuffix('s', secondsAgo, verbose)}`;
	} else if (withinTheHour) {
		// Minutes
		const minutes = Math.round(secondsAgo / 60);
		return `${minutes}${getSuffix('m', minutes, verbose)}`;
	} else if (within24hrs) {
		// Hours
		const hours = Math.round(secondsAgo / 3600);
		return `${hours}${getSuffix('h', hours, verbose)}`;
	} else if (wasYesterday && verbose) {
		// Yesterday
		return `Yesterday${withTime(then)}`;
	} else if (withinAbsoluteCutoff) {
		// Days
		const days = Math.round(secondsAgo / 3600 / 24);
		return `${days}${getSuffix('d', days, verbose)}`;
	} else {
		// Simple date - "9 Nov 2019"
		return [
			then.getDate(),
			verbose ? longMonth(then.getMonth()) : shortMonth(then.getMonth()),
			then.getFullYear(),
		].join(' ');
	}
};
