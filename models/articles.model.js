import db from "../db/connection.js";

export const fetchArticles = async (sort_by, order, topic) => {
  const articleColumns =
    "articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_id, articles.article_img_url,";

  const topicFilter = !topic ? "" : `WHERE topic = '${topic}'`;

  const sortBy =
    sort_by === "comment_count" ? "comment_count" : `articles.${sort_by}`;

  const result = await db.query(`
    SELECT ${articleColumns}
       COUNT(comments.comment_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    ${topicFilter} 
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${order};
  `);

  return result.rows;
};
