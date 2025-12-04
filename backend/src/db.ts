import { Pool } from "pg";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const DATABASE = String(process.env.DB_NAME);
const USERNAME = String(process.env.DB_USER);
const PASSWORD = String(process.env.DB_PASSWORD);
const HOST = String(process.env.DB_HOST);

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: "postgres",
});


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

pool.on("error", (err: Error) => {
  console.error("Unexpected Error on Idle Client", err);
  process.exit(-1);
});

const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

export default db;
