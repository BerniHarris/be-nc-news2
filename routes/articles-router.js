import express from "express";
import {
  getArticleById,
  getArticles,
} from "../controllers/articles.controller.js";

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);

export default articlesRouter;
