import db from "../../db/connection.js";
import seed from "../../db/seeds/seed.js";
import testData from "../../db/data/test-data";
import { fetchArticleById } from "../../models/articles.model.js";

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("fetchArticleById model", () => {
  test("returns correct article", async () => {
    const article = await fetchArticleById(1);
    expect(article.article_id).toBe(1);
    expect(article.comment_count).toBe(11);
  });

  test("rejects with custom error when not found", async () => {
    try {
      return await fetchArticleById(999);
    } catch (err) {
      expect(err.status).toBe(404);
      expect(err.message).toBe("Article not found");
    }
  });
});
