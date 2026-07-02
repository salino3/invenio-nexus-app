import express from "express";
import { AuthController } from "../../controllers/auth/auth.accounts.controller";

const routerAuth = express.Router();
const routeController = new AuthController();

routerAuth.post("login-account", routeController.loginAccount);

export default routerAuth;
