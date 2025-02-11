import type { FeedId } from './feed';

export enum ArticleStatus {
	UNREAD = 'unread',
	READ = 'read',
	ARCHIVED = 'archived',
}

const ArticleIdBrand = Symbol();
export type ArticleId = string & { [ArticleIdBrand]: undefined };

export type Article = Readonly<{
	id: ArticleId;
	feedId: FeedId;
	title: string;
	url: string;
	content: string;
	summary?: string;
	author?: string;
	publishedAt: Date;
	status: ArticleStatus;
	isFavorite: boolean;
	imageUrl?: string;
	categories: ArticleCategory[];
}>;

export function NewArticle({
	id,
	feedId,
	title,
	url,
	content,
	publishedAt,
	status,
	isFavorite,
	categories,
	summary,
	author,
	imageUrl,
}: Omit<Article, 'id'> & { id: string }): Article {
	return {
		id: id as ArticleId,
		feedId,
		title,
		url,
		content,
		publishedAt,
		status,
		isFavorite,
		categories,
		summary,
		author,
		imageUrl,
	};
}

export type ArticleFilter = Readonly<{
	status?: ArticleStatus;
	isFavorite?: boolean;
	categoryIds?: ArticleCategoryId[];
	feedIds?: FeedId[];
	searchQuery?: string;
}>;

export type ArticleHistory = Readonly<{
	articleId: ArticleId;
	previousStatus: ArticleStatus;
	newStatus: ArticleStatus;
	updatedAt: Date;
}>;

export type Tag = Readonly<{
	id: string;
	name: string;
	color?: string;
}>;

export type ArticleWithTags = Article & Readonly<{ tags: Tag[] }>;

const ArticleCategoryIdBrand = Symbol();
export type ArticleCategoryId = string & {
	[ArticleCategoryIdBrand]: undefined;
};
export type ArticleCategory = Readonly<{
	id: ArticleCategoryId;
	name: string;
}>;
