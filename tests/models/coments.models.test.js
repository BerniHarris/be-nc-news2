import db from "../../db/connection.js";
import seed from "../../db/seeds/seed.js";
import testData from "../../db/data/test-data";
import { fetchCommentsByArticleId } from "../../models/comments.models.js";

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("fetchCommentsByArticleId model", () => {
  test("returns correct comments for the article id", async () => {
    const comments = await fetchCommentsByArticleId(1);
    const commentsWithCorrectArticleId = comments.filter(
      (comment) => comment.article_id === 1,
    );
    expect(comments.length).toBe(11);
    expect(commentsWithCorrectArticleId.length).toBe(11);
  });

  test("rejects with custom error when not found", async () => {
    try {
      return await fetchCommentsByArticleId(999);
    } catch (err) {
      expect(err.status).toBe(404);
      expect(err.message).toBe("Article not found");
    }
  });
});
