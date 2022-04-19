import { articleDesign } from './ArticleDesign';
import { articleDisplay } from './ArticleDisplay';
import { articlePillar } from './ArticlePillar';
import { articleSpecial } from './ArticleSpecial';
import { articleTheme } from './ArticleTheme';

it('Design enum contains Article', () => {
	expect(articleDesign.Standard).toBeDefined();
});

it('Display enum contains Standard', () => {
	expect(articleDisplay.Standard).toBeDefined();
});

it('Pillar enum contains News', () => {
	expect(articlePillar.News).toBe(0);
});

it('Special enum contains SpecialReport', () => {
	expect(articleSpecial.SpecialReport).toBe(5);
});

it('Design has unique key-value pairs', () => {
	const keys = new Set(Object.keys(articleDesign));
	const values = new Set(Object.values(articleDesign));
	expect(keys.size).toEqual(values.size);
});

it('Display has unique key-value pairs', () => {
	const keys = new Set(Object.keys(articleDisplay));
	const values = new Set(Object.values(articleDisplay));
	expect(keys.size).toEqual(values.size);
});

it('Theme has unique key-value pairs', () => {
	const keys = new Set(Object.keys(articleTheme));
	const values = new Set(Object.values(articleTheme));
	expect(keys.size).toEqual(values.size);
});
