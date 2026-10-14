import db from "../db/connection.js";

export const fetchCommentsByArticleId = async (article_id) => {
  const { rows } = await db.query(
    `SELECT *
    FROM comments
    WHERE article_id = $1;`,
    [article_id],
  );

  if (!rows[0]) {
    return Promise.reject({ status: 404, message: "Article not found" });
  }

  return rows;
};
