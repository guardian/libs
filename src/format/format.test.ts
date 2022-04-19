import { isEnum } from '../isEnum/isEnum';
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

it('Design, Display & Theme are enum-like', () => {
	expect(isEnum(ArticleDesign)).toBe(true);
	expect(isEnum(ArticleDisplay)).toBe(true);
	expect(isEnum(ArticleTheme)).toBe(true);
});
