export const articleDisplay = {
	Standard: 0,
	Immersive: 1,
	Showcase: 2,
	NumberedList: 3,
} as const;

export type ArticleDisplay = keyof typeof articleDisplay;
