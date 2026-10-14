import { jest } from "@jest/globals";
import { updateArticleVotes } from "../../models/articles.models.js";

jest.unstable_mockModule("../../models/articles.models.js", () => {
  return {
    fetchArticles: jest.fn(),
    fetchArticleById: jest.fn(),
    updateArticleVotes: jest.fn(),
  };
});

jest.unstable_mockModule("../../models/comments.models.js", () => {
  return { fetchCommentsByArticleId: jest.fn() };
});

let fetchArticleById;
let fetchArticles;
let getArticles;
let fetchCommentsByArticleId;
let getCommentsByArticleId;

beforeAll(async () => {
  const models = await import("../../models/articles.models.js");
  const controllers = await import("../../controllers/articles.controller.js");
  const commentModels = await import("../../models/comments.models.js");

  fetchArticleById = models.fetchArticleById;
  fetchArticles = models.fetchArticles;
  fetchCommentsByArticleId = commentModels.fetchCommentsByArticleId;
  getArticles = controllers.getArticles;
  getCommentsByArticleId = controllers.getCommentsByArticleId;
});

describe("getArticles Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("200: responds with an array of articles", async () => {
    const fakeArticles = [{ article_id: 1, title: "Test Article" }];
    fetchArticles.mockResolvedValue(fakeArticles);

    const req = { query: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();

    await getArticles(req, res, next);

    expect(fetchArticles).toHaveBeenCalledWith("created_at", "desc", undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ articles: fakeArticles });
    expect(next).not.toHaveBeenCalled();
  });

  test("400: passes validation errors directly to next without calling the model", async () => {
    const req = { query: { sort_by: "invalid_column" } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    await getArticles(req, res, next);

    expect(fetchArticles).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test("500: handles internal database or model rejections by passing them to next", async () => {
    const mockDbError = new Error("Database connection timed out");

    fetchArticles.mockRejectedValue(mockDbError);

    const req = { query: {} };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    await getArticles(req, res, next);

    expect(fetchArticles).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(mockDbError);
    expect(res.send).not.toHaveBeenCalled();
  });
});

describe("getCommentsByArticleId Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("200: responds with an array of comments", async () => {
    const fakeComments = [
      {
        body: "I'm fake!",
        votes: 14,
        author: "butter_bridge",
        article_id: 1,
        created_at: 1604113380000,
      },
    ];

    fetchCommentsByArticleId.mockResolvedValue(fakeComments);

    const req = { params: { article_id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();

    await getCommentsByArticleId(req, res, next);

    expect(fetchCommentsByArticleId).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      comments: fakeComments,
    });

    expect(next).not.toHaveBeenCalled();
  });
  test("400: passes validation errors directly to next without calling the model", async () => {
    const req = { params: { article_id: "wrongwrongwrong" } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    await getCommentsByArticleId(req, res, next);

    expect(fetchCommentsByArticleId).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test("500: handles internal database or model rejections by passing them to next", async () => {
    const mockDbError = new Error("Database connection timed out");

    fetchCommentsByArticleId.mockRejectedValue(mockDbError);

    const req = { params: { article_id: 2 } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    await getCommentsByArticleId(req, res, next);

    expect(fetchCommentsByArticleId).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(mockDbError);
    expect(res.send).not.toHaveBeenCalled();
  });
});
