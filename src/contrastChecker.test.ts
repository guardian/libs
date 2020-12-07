import {
	calculateLuminance,
	getContrast,
	isContrastFriendly,
} from './contrastChecker';

describe('`calculateLuminance`', () => {
	test('should correctly calculate luminance for correct RGB', () => {
		expect(calculateLuminance([100, 200, 255])).toBeCloseTo(0.51);
		expect(calculateLuminance([0, 0, 0])).toBeCloseTo(0);
	});
});

describe('`getContrast`', () => {
	const seagreen = 'seagreen';
	const darkseagreen = 'darkseagreen';
	const blackHex = '#000000';
	const greyHex = '#666666';
	test('should correctly calculate contrast given appropriate values', () => {
		expect(getContrast(blackHex, greyHex)).toBeCloseTo(3.66);
		expect(getContrast(seagreen, darkseagreen)).toBeCloseTo(1.97);
		expect(getContrast(blackHex, seagreen)).toBeCloseTo(4.95);
	});
	test('should handle non-valid values correctly', () => {
		expect(getContrast(blackHex, 'foo')).toStrictEqual(null);
		expect(getContrast('bar', seagreen)).toStrictEqual(null);
		expect(getContrast('bar', 'soap')).toStrictEqual(null);
	});
});

describe('`isContrastFriendly`', () => {
	const seagreen = 'seagreen';
	const lightseagreen = 'lightseagreen';
	const blackHex = '#000000';
	test('should correctly identify AA contrast', () => {
		expect(isContrastFriendly(blackHex, seagreen).AA).toBe(true);
		expect(isContrastFriendly(blackHex, seagreen).AAA).toBe(false);
	});
	test('should correctly identify AAA contrast', () => {
		expect(isContrastFriendly(blackHex, lightseagreen).AA).toBe(true);
		expect(isContrastFriendly(blackHex, lightseagreen).AAA).toBe(true);
	});
	test('should return all false for invalid', () => {
		expect(isContrastFriendly('bar', 'soap').AA).toBe(false);
		expect(isContrastFriendly('bar', 'soap').AAA).toBe(false);
	});
});
