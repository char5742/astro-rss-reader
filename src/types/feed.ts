const FeedIdBrand = Symbol();

export type FeedId = string & { [FeedIdBrand]: undefined };

export type Feed = Readonly<{
	id: FeedId;
	title: string;
	url: string;
	categoryIds: FeedCategoryId[];
	description?: string;
	lastUpdated?: Date;
	imageUrl?: string;
}>;

const FeedCategoryIdBrand = Symbol();

export type FeedCategoryId = string & { [FeedCategoryIdBrand]: undefined };

export type FeedCategory = Readonly<{
	id: FeedCategoryId;
	name: string;
}>;

export type FeedWithCategories = Feed &
	Readonly<{
		categories: FeedCategory[];
	}>;

export type Subscription = Readonly<{
	feedId: FeedId;
	subscribedAt: Date;
	notificationsEnabled: boolean;
}>;
