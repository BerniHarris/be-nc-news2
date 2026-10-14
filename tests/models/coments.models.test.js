import db from "../../db/connection.js";
import seed from "../../db/seeds/seed.js";
import testData from "../../db/data/test-data";
import {
  fetchCommentsByArticleId,
  addCommentToArticle,
} from "../../models/comments.models.js";

beforeEach(() => seed(testData));
afterAll(async () => db.end());

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

describe("addCommentToArticle Model", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM comments;");
  });

  test("should successfully insert a new comment and return the inserted row", async () => {
    const testArticleId = 1;
    const testAuthor = "butter_bridge";
    const testBody = "This is a fantastic article!";

    const result = await addCommentToArticle(
      testArticleId,
      testAuthor,
      testBody,
    );
    expect(result).toBeDefined();
    expect(result.body).toBe(testBody);
    expect(result.author).toBe(testAuthor);
    expect(result.article_id).toBe(1);
  });
});
