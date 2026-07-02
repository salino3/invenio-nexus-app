import dotenv from "dotenv";
dotenv.config();

export const {
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  DATABASE,
  DB_PORT = 5432,
  PORT = 3000,
  SECRET_KEY,
  //
  FRONTEND_DEV_PORT,
  FRONTEND_PROD_PORT,
} = process.env;
