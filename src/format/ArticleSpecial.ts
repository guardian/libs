export const articleSpecial = {
	SpecialReport: 5,
	Labs: 6,
} as const;

export type ArticleSpecial = keyof typeof articleSpecial;
