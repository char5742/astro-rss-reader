import { column, defineDb, defineTable } from 'astro:db';

const Article = defineTable({
	columns: {
		id: column.text(),
		userId: column.text(),
		feedId: column.text(),
		title: column.text(),
		url: column.text(),
		content: column.text(),
		summary: column.text(),

		author: column.text(),
		publishedAt: column.date(),
		status: column.text(),
		isFavorite: column.boolean(),
		imageUrl: column.text(),
	},
});

const ArticleCategories = defineTable({
	columns: {
		articleId: column.text(),
		categoryId: column.text(),
	},
});

const Category = defineTable({
	columns: {
		id: column.text(),
		userId: column.text(),
		name: column.text(),
	},
});

const Feed = defineTable({
	columns: {
		id: column.text(),
		userId: column.text(),
		title: column.text(),
		url: column.text(),
		description: column.text(),
		lastUpdated: column.date(),
		imageUrl: column.text(),
	},
});

const Account = defineTable({
	columns: {
		id: column.text(),
		email: column.text(),
	},
});

const User = defineTable({
	columns: {
		id: column.text(),
		accountId: column.text(),
		name: column.text(),
		settings: column.json(),
	},
});

export default defineDb({
	tables: {
		Article,
		ArticleCategories,
		Category,
		Feed,
		Account,
		User,
	},
});
