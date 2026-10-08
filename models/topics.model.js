import db from "../db/connection.js";

export const fetchTopics = async () => {
  const result = await db.query("SELECT * FROM topics;");
  return result.rows;
};
