import express from "express";
import {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} from "../controllers/articles.controller.js";

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

export default articlesRouter;
