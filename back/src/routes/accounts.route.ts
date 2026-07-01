import express from "express";
import { AuthController } from "../controllers/account.controller";

const routerAuth = express.Router();
const authController = new AuthController();

routerAuth.post("/register-account", authController.registerAccount);

export default routerAuth;
