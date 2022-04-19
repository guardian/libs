import { ArticleDesign } from './ArticleDesign';
import { ArticleDisplay } from './ArticleDisplay';
import { ArticlePillar } from './ArticlePillar';
import { ArticleSpecial } from './ArticleSpecial';
import { ArticleTheme } from './ArticleTheme';

it('Design enum contains Article', () => {
	expect(ArticleDesign.Standard).toBeDefined();
});

it('Display enum contains Standard', () => {
	expect(ArticleDisplay.Standard).toBeDefined();
});

it('Pillar enum contains News', () => {
	expect(ArticlePillar.News).toBe(0);
});

it('Special enum contains SpecialReport', () => {
	expect(ArticleSpecial.SpecialReport).toBe(5);
});

it('Design has unique key-value pairs', () => {
	const keys = new Set(Object.keys(ArticleDesign));
	const values = new Set(Object.values(ArticleDesign));
	expect(keys.size).toEqual(values.size);
});

it('Display has unique key-value pairs', () => {
	const keys = new Set(Object.keys(ArticleDisplay));
	const values = new Set(Object.values(ArticleDisplay));
	expect(keys.size).toEqual(values.size);
});

it('Theme has unique key-value pairs', () => {
	const keys = new Set(Object.keys(ArticleTheme));
	const values = new Set(Object.values(ArticleTheme));
	expect(keys.size).toEqual(values.size);
});
