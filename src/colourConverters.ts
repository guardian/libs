import type { ColourName } from './types/namedColours';
import { NamedColours } from './types/namedColours';

export const nameToHex = (name: ColourName): string => {
	const hexcode = NamedColours[name];
	return hexcode;
};

export const hexToRGB = (hex: string): number[] | null => {
	const shorthandRegex = /^#([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(
		shorthandRegex,
		function (m, r: string, g: string, b: string) {
			return '#' + r + r + g + g + b + b;
		},
	);

	const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16),
		  ]
		: null;
};

export const isHexCode = (hex: string): boolean => {
	const isLongcode = /^#[a-f\d]{6}$/i.test(hex);
	const isShortcode = /^#[a-f\d]{3}$/i.test(hex);

	return isShortcode || isLongcode;
};

export const isNamedColour = (
	colour: string | ColourName,
): colour is ColourName => {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Needed for typechecking despite what the linter says
	return NamedColours[colour as ColourName] !== undefined;
};
