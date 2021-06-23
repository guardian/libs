import { Design, Display, Pillar, Special } from './format';

it('Design enum contains Article', () => {
	expect(Design.Article).toBeDefined();
});

it('Display enum contains Standard', () => {
	expect(Display.Standard).toBeDefined();
});

it('Pillar enum contains News', () => {
	expect(Pillar.News).toBe(0);
});

it('Special enum contains SpecialReport', () => {
	expect(Special.SpecialReport).toBe(5);
});
