import dotenv from "dotenv";
dotenv.config();

export const {
  USER,
  HOST,
  PASSWORD,
  DATABASE,
  PORT_DB,
  PORT = 3000,
  SECRET_KEY,
  //
  FRONTEND_DEV_PORT,
  FRONTEND_PROD_PORT,
} = process.env;
