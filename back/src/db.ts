import { Pool } from "pg";
import { DB_USER, DB_HOST, DB_PASSWORD, DATABASE, DB_PORT } from "./constants";

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  database: DATABASE,
  port: parseInt(DB_PORT || "5432", 10),
});

export function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
