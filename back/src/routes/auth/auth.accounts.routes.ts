import express from "express";
import { authController } from "../../controllers/auth/auth.accounts.controller";

const routerAuth = express.Router();

routerAuth.post("/login-account", authController.loginAccount);

export default routerAuth;
