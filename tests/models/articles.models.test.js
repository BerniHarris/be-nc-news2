import db from "../../db/connection.js";
import seed from "../../db/seeds/seed.js";
import testData from "../../db/data/test-data/index.js";

import {
  fetchArticles,
  fetchArticleById,
  updateArticleVotes,
} from "../../models/articles.models.js";

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("fetchArticleById model", () => {
  test("returns the correct article object including comment_count", async () => {
    const article = await fetchArticleById(1);
    expect(article.article_id).toBe(1);
    expect(article.comment_count).toBe(11);
    console.log(article);
    expect(article).toEqual(
      expect.objectContaining({
        author: expect.any(String),
        title: expect.any(String),
        topic: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(Date),
        votes: expect.any(Number),
        article_id: 1,
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      }),
    );
  });

  test("rejects with custom 404 error when article does not exist", async () => {
    try {
      await fetchArticleById(9999);
    } catch (err) {
      expect(err.status).toBe(404);
      expect(err.message).toBe("Article not found");
    }
  });
});

describe("fetchArticles model", () => {
  describe("Success behaviour", () => {
    test("returns all articles sorted by created_at DESC by default", async () => {
      const articles = await fetchArticles();
      expect(articles).toBeSortedBy("created_at", { descending: true });
      expect(articles.length).toBe(13);
    });

    test("returns articles filtered by topic", async () => {
      const articles = await fetchArticles("created_at", "desc", "mitch");
      expect(articles.length).toBeGreaterThan(0);
      expect(articles.every((a) => a.topic === "mitch")).toBe(true);
    });

    test("returns empty array when topic exists but has no articles", async () => {
      // paper exists but has no articles in test data
      const articles = await fetchArticles("created_at", "desc", "paper");
      expect(articles).toEqual([]);
    });

    test("sorts articles by all valid columns in ASC order", async () => {
      const validSorts = [
        "author",
        "title",
        "topic",
        "created_at",
        "votes",
        "article_id",
        "article_img_url",
        "comment_count",
      ];

      for (const column of validSorts) {
        const articles = await fetchArticles(column, "asc");
        expect(articles).toBeSortedBy(column);
      }
    });

    test("sorts articles by all valid columns in DESC order", async () => {
      const validSorts = [
        "author",
        "title",
        "topic",
        "created_at",
        "votes",
        "article_id",
        "article_img_url",
        "comment_count",
      ];

      for (const column of validSorts) {
        const articles = await fetchArticles(column, "desc");
        expect(articles).toBeSortedBy(column, { descending: true });
      }
    });

    test("sorts correctly by comment_count", async () => {
      const articles = await fetchArticles("comment_count", "desc");
      expect(articles).toBeSortedBy("comment_count", { descending: true });
    });
  });

  describe("Error behaviour", () => {
    test("rejects with 404 when topic does not exist", async () => {
      try {
        await fetchArticles("created_at", "desc", "not_a_topic");
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.message).toBe("Topic not found");
      }
    });
  });
});

describe("updateArticleVotes model", () => {
  test("increments article votes", async () => {
    const updated = await updateArticleVotes(1, 1);
    expect(updated.votes).toBe(101);
  });

  test("decrements article votes", async () => {
    const updated = await updateArticleVotes(-1, 1);
    expect(updated.votes).toBe(99);
  });

  test("rejects with 404 when article does not exist", async () => {
    try {
      await updateArticleVotes(1, 9999);
    } catch (err) {
      expect(err.status).toBe(404);
      expect(err.message).toBe("Article not found");
    }
  });
});
