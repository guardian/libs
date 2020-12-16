import { hexToRGB, isNamedColour, nameToHex } from './colourConverters';
import type { ColourName } from './types/namedColours';

// From https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors/9733420#9733420
export const calculateLuminance = (rgb: number[]): number => {
	const a = rgb.map(function (v) {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getContrast = (
	fg: string | ColourName,
	bg: string | ColourName,
): number | null => {
	const fgRGB = isNamedColour(fg) ? hexToRGB(nameToHex(fg)) : hexToRGB(fg);
	const bgRGB = isNamedColour(bg) ? hexToRGB(nameToHex(bg)) : hexToRGB(bg);

	if (fgRGB && bgRGB) {
		const fgLum = calculateLuminance(fgRGB);
		const bgLum = calculateLuminance(bgRGB);
		const brightest = Math.max(fgLum, bgLum);
		const darkest = Math.min(fgLum, bgLum);
		return (brightest + 0.05) / (darkest + 0.05);
	} else {
		return null;
	}
};

export const isContrastAccessible = (
	fg: string | ColourName,
	bg: string | ColourName,
): { AA: boolean; AAA: boolean } => {
	const contrast = getContrast(fg, bg);
	if (contrast) {
		return {
			AA: contrast > 4.5,
			AAA: contrast > 7,
		};
	} else {
		return {
			AA: false,
			AAA: false,
		};
	}
};
