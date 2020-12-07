import {
	hexToRGB,
	isHexCode,
	isNamedColour,
	nameToHex,
} from './colourConverters';

describe('`isHexCode`', () => {
	test('should return true given a valid hexcode', () => {
		expect(isHexCode('#000')).toBe(true);
		expect(isHexCode('#0101ff')).toBe(true);
	});

	test('should return false given something not a short hexcode', () => {
		expect(isHexCode('#0000')).toBe(false);
		expect(isHexCode('#00y')).toBe(false);
		expect(isHexCode('seagreen')).toBe(false);
		expect(isHexCode('foo bar')).toBe(false);
	});
});

describe('`isNamedColour`', () => {
	test('should return true given a valid name', () => {
		expect(isNamedColour('seagreen')).toBe(true);
	});

	test('should return false given an invalid name', () => {
		expect(isNamedColour('#000')).toBe(false);
		expect(isNamedColour('foo bar')).toBe(false);
	});
});

describe('`nameToHex`', () => {
	test('should return a valid hexcode from a correct colour name', () => {
		expect(nameToHex('seagreen')).toBe('#2e8b57');
	});
});

describe('`hexToRGB`', () => {
	test('should return a valid RGB given a valid hexcode', () => {
		expect(hexToRGB('#012')).toStrictEqual([0, 17, 34]);
		expect(hexToRGB('#012345')).toStrictEqual([1, 35, 69]);
	});

	test('should return null when given an ivalid hexcode', () => {
		expect(hexToRGB('#0123')).toBe(null);
		expect(hexToRGB('seagreen')).toBe(null);
		expect(hexToRGB('foo bar')).toBe(null);
	});
});
