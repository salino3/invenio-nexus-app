import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import passport from "./src/config/passport";
// Routes
import routerAccount from "./src/routes/accounts.route";
import routerAuth from "./src/routes/auth/auth.accounts.routes";
import routerCompanies from "./src/routes/companies.route";
import routerSubscriptions from "./src/routes/subscriptions.router";
import { stripeServices } from "./src/services/stripe-services";
//
import { FRONTEND_DEV_PORT, FRONTEND_PROD_PORT, PORT } from "./src/constants";

const app = express();

app.use(morgan("dev"));
app.use(passport.initialize());
app.use(cookieParser());

// Stripe webhook FIRST
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeServices.handleStripeWebhook,
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? FRONTEND_PROD_PORT
        : FRONTEND_DEV_PORT,
    credentials: true,
  }),
);

// Serve assets folder physically stored on server locally
app.use("/uploads", express.static(path.join(__dirname, "./public/uploads")));

// General health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "online", project: "Invenio Nexus Backend" });
});

app.use("/api", routerAccount);
app.use("/api", routerAuth);
app.use("/api", routerCompanies);
app.use("/api", routerSubscriptions);

app.listen(PORT, () => {
  console.log(`🚀 Server up and running at http://localhost:${PORT}`);
});
