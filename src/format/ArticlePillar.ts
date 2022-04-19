export const articlePillar = {
	News: 0,
	Opinion: 1,
	Sport: 2,
	Culture: 3,
	Lifestyle: 4,
} as const;

export type ArticlePillar = keyof typeof articlePillar;
