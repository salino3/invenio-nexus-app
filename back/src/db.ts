import { Pool, QueryResult } from "pg";
import { DB_USER, DB_HOST, DB_PASSWORD, DATABASE, DB_PORT } from "./constants";

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  database: DATABASE,
  port: Number(DB_PORT),
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,
});

export function query(text: string, params?: any[]): Promise<QueryResult<any>> {
  return pool.query(text, params);
}
