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
