import express from "express";
import { deleteArticleComment } from "../controllers/comments.controller.js";

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteArticleComment);

export default commentsRouter;
