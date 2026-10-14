import { validateId } from "../validation/validation.js";
const validSorts = [
  "author",
  "title",
  "topic",
  "created_at",
  "votes",
  "article_id",
  "article_img_url",
  "comment_count",
];

const validOrders = ["asc", "desc"];

export const queryArticleValidation = (sort_by, order, topic) => {
  if (!validSorts.includes(sort_by)) {
    return { status: 400, message: "Invalid sort_by" };
  }

  if (!validOrders.includes(order)) {
    return { status: 400, message: "Invalid order" };
  }

  if (topic && typeof topic !== "string") {
    return { status: 404, message: "Invalid topic" };
  }

  return null;
};

export const validateArticleVote = (articleId, vote) => {
  const idError = validateId(articleId, "article id");
  if (idError) return idError;
  if (!vote) {
    return { status: 400, message: "inc_votes is required" };
  }

  if (typeof vote !== "number") {
    return { status: 400, message: "Invalid inc_votes" };
  }
  return null;
};
