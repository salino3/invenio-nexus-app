import express from "express";
import { accountController } from "../controllers/account.controller";

const routerAccount = express.Router();

routerAccount.post("/register-account", accountController.registerAccount);

routerAccount.get("/accounts", accountController.getAllAccounts);

routerAccount.get("/accounts/actives", accountController.getAllAccountsActives);

export default routerAccount;
