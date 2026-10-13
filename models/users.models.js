import db from "../db/connection.js";

export const fetchUsers = async () => {
  const result = await db.query("SELECT * FROM users;");
  return result.rows;
};
