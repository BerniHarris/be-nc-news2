import { validateComment } from "../helpers/validation/comments.validation.js";
import { validateId } from "../helpers/validation/validation.js";
import {
  addCommentToArticle,
  fetchComment,
  deleteComment,
} from "../models/comments.models.js";

export const postArticleComment = async (req, res, next) => {
  const { article_id: articleId } = req.params;
  const { username: author, body } = req.body;

  const commentError = validateComment(articleId, author, body);
  if (commentError) return next(commentError);
  try {
    const comment = await addCommentToArticle(articleId, author, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

export const deleteArticleComment = async (req, res, next) => {
  const { comment_id: commentId } = req.params;
  const idError = validateId(commentId, "commment id");
  if (idError) return next(idError);

  try {
    await fetchComment(commentId);
    await deleteComment(commentId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
