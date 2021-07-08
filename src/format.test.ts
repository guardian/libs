import {
	ArticleDesign,
	ArticleDisplay,
	ArticlePillar,
	ArticleSpecial,
} from './format';

it('Design enum contains Article', () => {
	expect(ArticleDesign.Article).toBeDefined();
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
