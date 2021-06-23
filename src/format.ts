// ----- Types ----- //

enum Pillar {
	News = 0,
	Opinion = 1,
	Sport = 2,
	Culture = 3,
	Lifestyle = 4,
}

enum Special {
	SpecialReport = 5,
	Labs = 6,
}

type Theme = Pillar | Special;

enum Design {
	Article,
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
}

enum Display {
	Standard,
	Immersive,
	Showcase,
	NumberedList,
}

interface Format {
	theme: Theme;
	design: Design;
	display: Display;
}

// ----- Exports ----- //

export type { Theme, Format };
export { Pillar, Special, Design, Display };
