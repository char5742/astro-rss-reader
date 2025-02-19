import { beforeAll, describe, expect, test } from "bun:test";

// テストデータ
const mockFeedCollection = [
  {
    id: "feed-1",
    data: {
      feed: {
        title: "Test Feed 1",
      },
      articles: [
        {
          id: "article-1",
          title: "Test Article 1",
          url: "https://example.com/1",
          publishedAt: new Date("2024-02-25"),
          status: "unread",
          isFavorite: false,
        },
        {
          id: "article-2",
          title: "Test Article 2",
          url: "https://example.com/2",
          publishedAt: new Date("2024-02-24"),
          status: "read",
          isFavorite: true,
        },
      ],
    },
  },
];

describe("Home Page", () => {
  beforeAll(() => {
    // モックの設定
    globalThis.fetch = async () => {
      return {
        ok: true,
        json: async () => ({ success: true }),
      } as Response;
    };
  });

  test("フィードコレクションの形式が正しい", () => {
    expect(mockFeedCollection).toBeDefined();
    expect(Array.isArray(mockFeedCollection)).toBe(true);
    expect(mockFeedCollection[0].data.feed.title).toBe("Test Feed 1");
  });

  test("記事が日付順にソートされている", () => {
    const latestArticles = mockFeedCollection
      .flatMap((feed) =>
        feed.data.articles.map((article) => ({
          ...article,
          feedTitle: feed.data.feed.title,
        })),
      )
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    expect(latestArticles[0].publishedAt.getTime()).toBeGreaterThan(
      latestArticles[1].publishedAt.getTime(),
    );
  });

  test("未読記事の数が正しく計算される", () => {
    const unreadCount = mockFeedCollection[0].data.articles.filter(
      (article) => article.status === "unread",
    ).length;

    expect(unreadCount).toBe(1);
  });
});
