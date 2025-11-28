import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 8000),
});

pool.on("connect", () => {
  console.log("Database Connected Successfully");
});

pool.on("error", (err) => {
  console.error("Unexpected Error on Idle Client", err);
  process.exit(-1);
});

const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

export default db;
