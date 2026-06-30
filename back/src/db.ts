import { Pool } from "pg";
import { USER, HOST, PASSWORD, DATABASE, PORT_DB } from "./constants";

const pool = new Pool({
  user: USER,
  host: HOST,
  password: PASSWORD,
  database: DATABASE,
  port: parseInt(PORT_DB || "5432", 10),
});

export default {
  /**
   * Execute a SQL query with parameters
   */
  query: (text: string, params?: any[]) => pool.query(text, params),
};
