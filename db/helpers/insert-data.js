import { formatDate, createRef, formatComments } from "./utils.js";
import format from "pg-format";

export const insertAllData = async (db, data) => {
  const { topicData, userData, articleData, commentData } = data;

  const insertTopicsQueryStr = format(
    "INSERT INTO topics (slug, description) VALUES %L;",
    topicData.map(({ slug, description }) => [slug, description]),
  );

  const topicsPromise = db.query(insertTopicsQueryStr);

  const insertUsersQueryStr = format(
    "INSERT INTO users ( username, name, avatar_url) VALUES %L;",
    userData.map(({ username, name, avatar_url }) => [
      username,
      name,
      avatar_url,
    ]),
  );

  const usersPromise = db.query(insertUsersQueryStr);

  await Promise.all([topicsPromise, usersPromise]);

  const formattedArticleData = articleData.map(formatDate);

  const insertArticlesQueryStr = format(
    "INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;",
    formattedArticleData.map(
      ({
        title,
        topic,
        author,
        body,
        created_at,
        votes = 0,
        article_img_url,
      }) => [title, topic, author, body, created_at, votes, article_img_url],
    ),
  );

  const { rows: articleRows } = await db.query(insertArticlesQueryStr);

  const articleIdLookup = createRef(articleRows, "title", "article_id");

  const formattedCommentData = formatComments(commentData, articleIdLookup);

  const insertCommentsQueryStr = format(
    "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;",
    formattedCommentData.map(
      ({
        body: body_1,
        author: author_1,
        article_id,
        votes: votes_1 = 0,
        created_at: created_at_1,
      }) => [body_1, author_1, article_id, votes_1, created_at_1],
    ),
  );

  return await db.query(insertCommentsQueryStr);
};
