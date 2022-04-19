import { articlePillar } from './ArticlePillar';
import { articleSpecial } from './ArticleSpecial';

export const articleTheme = { ...articlePillar, ...articleSpecial } as const;
export type ArticleTheme = keyof typeof articleTheme;
