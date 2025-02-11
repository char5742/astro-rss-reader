const FeedIdBrand = Symbol();

export type FeedId = string & { [FeedIdBrand]: undefined };

export type Feed = Readonly<{
	id: FeedId;
	title: string;
	url: string;
	categoryIds: CategoryId[];
	description?: string;
	lastUpdated?: Date;
	imageUrl?: string;
}>;

const CategoryIdBrand = Symbol();

export type CategoryId = string & { [CategoryIdBrand]: undefined };

export type Category = Readonly<{
	id: CategoryId;
	name: string;
	color?: string;
}>;

export type FeedWithCategories = Feed &
	Readonly<{
		categories: Category[];
	}>;

export type Subscription = Readonly<{
    feedId: FeedId;
    subscribedAt: Date;
    notificationsEnabled: boolean;
}>;
