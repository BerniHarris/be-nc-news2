import { fetchArticles } from "../models/articles.model.js";
import { queryArticleValidation } from "../helpers/validation/articles.validation.js";

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
