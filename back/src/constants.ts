import dotenv from "dotenv";
dotenv.config();

export const {
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  DATABASE,
  DB_PORT = 5432,
  PORT = 3000,
  //
  SECRET_KEY,
  COOKIES_NAME,
  //
  FRONTEND_DEV_PORT,
  FRONTEND_PROD_PORT,
  // Email sender SMTP (Simple Mail Transfer Protocol)
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  // Google OAuth
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  // Stripe
  STRIPE_SECRET_KEY = "",
  STRIPE_WEBHOOK_SECRET = "",
} = process.env;
