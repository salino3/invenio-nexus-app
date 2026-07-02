import express from "express";
import { AccountController } from "../controllers/account.controller";

const routerAccount = express.Router();
const accountController = new AccountController();

routerAccount.post("/register-account", accountController.registerAccount);

routerAccount.get("/accounts", accountController.getAllAccounts);

routerAccount.get("/accounts/actives", accountController.getAllAccountsActives);

export default routerAccount;
