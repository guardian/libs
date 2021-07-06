import { joinUrl } from './joinUrl';

describe('joinUrl', () => {
	it('prevents double slashes correctly', () => {
		expect(joinUrl('http://example.com/', '/abc/', '/xyz/')).toBe(
			'http://example.com/abc/xyz',
		);
	});

	it('adds slashes if none are present', () => {
		expect(joinUrl('http://example.com', 'abc', 'xyz')).toBe(
			'http://example.com/abc/xyz',
		);
	});

	it('deals with combinations of slash present and not', () => {
		expect(joinUrl('http://example.com/', 'abc/', '/xyz')).toBe(
			'http://example.com/abc/xyz',
		);
	});

	it('works with normal strings', () => {
		expect(joinUrl('/notadomain/', 'abc/', '/xyz')).toBe(
			'notadomain/abc/xyz',
		);
	});

	it('returns an empty string on empty input', () => {
		expect(joinUrl()).toBe('');
	});

	it('works with a filename', () => {
		expect(joinUrl('/AudioAtomWrapper.js')).toBe('AudioAtomWrapper.js');
	});

	it('works when the filename has special characters in it', () => {
		expect(
			joinUrl(
				'/vendors~AudioAtomWrapper~elements-YoutubeBlockComponent.js',
			),
		).toBe('vendors~AudioAtomWrapper~elements-YoutubeBlockComponent.js');
	});
});
