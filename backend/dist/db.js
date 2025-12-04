"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
const DATABASE = String(process.env.DB_NAME);
const USERNAME = String(process.env.DB_USER);
const PASSWORD = String(process.env.DB_PASSWORD);
const HOST = String(process.env.DB_HOST);
const sequelize = new sequelize_1.Sequelize(DATABASE, USERNAME, PASSWORD, {
    host: HOST,
    dialect: "postgres",
});
const isProduction = process.env.NODE_ENV === "production";
const connectionString = process.env.DATABASE_URL;
const connectionConfig = isProduction
    ? {
        connectionString: connectionString,
        // Render requires SSL to be explicitly set to reject unauthorized for secure connection
        ssl: { rejectUnauthorized: false },
    }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT || 8000),
    };
const pool = new pg_1.Pool(connectionConfig);
pool.on("connect", () => {
    console.log("Database Connected Successfully");
});
pool.on("error", (err) => {
    console.error("Unexpected Error on Idle Client", err);
    process.exit(-1);
});
const db = {
    query: (text, params) => pool.query(text, params),
};
exports.default = db;
