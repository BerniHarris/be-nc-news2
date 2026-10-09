import express from "express";
import { getArticles } from "../controllers/articles.controller.js";

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);

export default articlesRouter;
