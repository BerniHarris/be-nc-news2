import { validateComment } from "../helpers/validation/comments.validation.js";
import { addCommentToArticle } from "../models/comments.models.js";

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
