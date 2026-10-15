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

export const addCommentToArticle = async (articleId, author, body) => {
  const { rows } = await db.query(
    `INSERT INTO comments (article_id, author, body)
     VALUES ($1, $2, $3)
     RETURNING *;`,
    [articleId, author, body],
  );
  return rows[0];
};

export const fetchComment = async (comment_id) => {
  const { rows } = await db.query(
    `SELECT *
    FROM comments
    WHERE comment_id = $1;`,
    [comment_id],
  );
  if (!rows[0]) {
    return Promise.reject({ status: 404, message: "Comment not found" });
  }

  return rows[0];
};

export const deleteComment = async (comment_id) => {
  const { rows } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [comment_id],
  );

  return rows[0];
};
