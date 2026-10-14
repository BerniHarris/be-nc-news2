import {
  fetchArticles,
  fetchArticleById,
  updateArticleVotes,
} from "../models/articles.models.js";
import { fetchCommentsByArticleId } from "../models/comments.models.js";
import {
  queryArticleValidation,
  validateArticleVote,
} from "../helpers/validation/articles.validation.js";
import { validateId } from "../helpers/validation/validation.js";

export const getArticles = async (req, res, next) => {
  const { sort_by = "created_at", order = "desc", topic } = req.query;
  const validationError = queryArticleValidation(sort_by, order, topic);
  if (validationError) return next(validationError);

  try {
    const articles = await fetchArticles(sort_by, order, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (req, res, next) => {
  const { article_id: articleId } = req.params;
  const idError = validateId(articleId, "article id");
  if (idError) return next(idError);

  try {
    const article = await fetchArticleById(articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

export const getCommentsByArticleId = async (req, res, next) => {
  const { article_id: articleId } = req.params;
  const idError = validateId(articleId, "article id");
  if (idError) return next(idError);

  try {
    const comments = await fetchCommentsByArticleId(articleId);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

export const patchArticle = async (req, res, next) => {
  const { article_id: articleId } = req.params;
  const { inc_votes: vote } = req.body;

  const commentError = validateArticleVote(articleId, vote);
  if (commentError) return next(commentError);
  try {
    const article = await updateArticleVotes(vote, articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
