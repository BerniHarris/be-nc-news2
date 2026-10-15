import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV = process.env.NODE_ENV || "development";

if (!process.env.DATABASE_URL) {
  dotenv.config({
    path: path.join(__dirname, `../.env.${ENV}`),
  });
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};

if (process.env.DATABASE_URL) {
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = { rejectUnauthorized: false };
} else {
  config.host = process.env.PGHOST;
  config.database = process.env.PGDATABASE;
  config.user = process.env.PGUSER;
  config.password = process.env.PGPASSWORD;
  config.port = process.env.PGPORT;
}

const db = new Pool(config);

export default db;
