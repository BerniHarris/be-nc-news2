import db from "../connection.js";
import { dropAllTables } from "../helpers/drop-tables.js";
import { createAllTables } from "../helpers/create-tables.js";
import { insertAllData } from "../helpers/insert-data.js";

const seed = async (data) => {
  await dropAllTables(db);
  await createAllTables(db);
  await insertAllData(db, data);
};

export default seed;
