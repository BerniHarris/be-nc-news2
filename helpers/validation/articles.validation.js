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
    return next({ status: 400, msg: "Invalid sort_by" });
  }

  if (!validOrders.includes(order)) {
    return next({ status: 400, msg: "Invalid order" });
  }

  if (topic && typeof topic !== "string") {
    return next({ status: 400, msg: "Invalid topic" });
  }

  return null;
};
