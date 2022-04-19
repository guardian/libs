import type { ArticleDesign } from './ArticleDesign';
import type { ArticleDisplay } from './ArticleDisplay';
import type { ArticleTheme } from './ArticleTheme';

export interface ArticleFormat {
	theme: typeof ArticleTheme;
	design: typeof ArticleDesign;
	display: typeof ArticleDisplay;
}
