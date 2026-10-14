import db from "../db/connection.js";

export const fetchArticles = async (sort_by, order, topic) => {
  const articleColumns =
    "articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_id, articles.article_img_url,";

  const topicFilter = !topic ? "" : `WHERE topic = '${topic}'`;

  const sortBy =
    sort_by === "comment_count" ? "comment_count" : `articles.${sort_by}`;

  const { rows } = await db.query(`
    SELECT ${articleColumns}
       COUNT(comments.comment_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    ${topicFilter} 
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${order};
  `);

  return rows;
};

export const fetchArticleById = async (article_id) => {
  const { rows } = await db.query(
    `SELECT articles.*,
       COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
 `,
    [article_id],
  );

  if (!rows[0]) {
    return Promise.reject({ status: 404, message: "Article not found" });
  }

  return rows[0];
};

export const updateArticleVotes = async (vote, articleId) => {
  const { rows } = await db.query(
    `UPDATE articles 
     SET votes = votes + $1 
     WHERE article_id = $2 
     RETURNING *;`,
    [vote, articleId],
  );

  if (!rows[0]) {
    return Promise.reject({ status: 404, message: "Article not found" });
  }

  return rows[0];
};
