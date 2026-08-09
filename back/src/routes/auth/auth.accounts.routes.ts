import express from "express";
import passport from "passport";
import { authController } from "../../controllers/auth/auth.accounts.controller";
import { oauthController } from "../../controllers/auth/oauth.controller";

const routerAuth = express.Router();

routerAuth.post("/login-account", authController.loginAccount);

routerAuth.post("/logout-account", authController.logoutAccount);

routerAuth.post("/auth/refresh-token", authController.refreshToken);

routerAuth.get("/auth/get-me", authController.getMe);

// Google OAuth Routes
routerAuth.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    // To show always screen for choose email
    prompt: "select_account",
  }),
);

routerAuth.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  oauthController.googleCallback,
);

export default routerAuth;
