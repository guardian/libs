// ----- Types ----- //

enum ArticlePillar {
	News = 0,
	Opinion = 1,
	Sport = 2,
	Culture = 3,
	Lifestyle = 4,
}

enum ArticleSpecial {
	SpecialReport = 5,
	Labs = 6,
}

type ArticleTheme = ArticlePillar | ArticleSpecial;

enum ArticleDesign {
	Standard,
	Media,
	Review,
	Analysis,
	Comment,
	Letter,
	Feature,
	LiveBlog,
	DeadBlog,
	Recipe,
	MatchReport,
	Interview,
	Editorial,
	Quiz,
	Interactive,
	PhotoEssay,
	PrintShop,
	Obituary,
}

enum ArticleDisplay {
	Standard,
	Immersive,
	Showcase,
	NumberedList,
}

interface ArticleFormat {
	theme: ArticleTheme;
	design: ArticleDesign;
	display: ArticleDisplay;
}

// ----- Exports ----- //

export type { ArticleTheme, ArticleFormat };
export { ArticlePillar, ArticleSpecial, ArticleDesign, ArticleDisplay };
