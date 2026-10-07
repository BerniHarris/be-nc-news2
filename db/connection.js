import { Pool } from "pg";
import dotenv from "dotenv";

const ENV = process.env.NODE_ENV || "development";

console.log(`Running on environment: ${ENV}`);

dotenv.config({ path: `.env.${ENV}` });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};
const db = new Pool(config);

export default db;
