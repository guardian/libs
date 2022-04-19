import { ArticlePillar } from './ArticlePillar';
import { ArticleSpecial } from './ArticleSpecial';

export const ArticleTheme = { ...ArticlePillar, ...ArticleSpecial } as const;
