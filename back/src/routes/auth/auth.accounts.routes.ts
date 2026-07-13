import express from "express";
import passport from "passport";
import { authController } from "../../controllers/auth/auth.accounts.controller";
import { oauthController } from "../../controllers/auth/oauth.controller";

const routerAuth = express.Router();

routerAuth.post("/login-account", authController.loginAccount);

routerAuth.get("/auth/get-me", authController.getMe);

routerAuth.post("/refresh-token", authController.refreshToken);

// Google OAuth Routes
routerAuth.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
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
