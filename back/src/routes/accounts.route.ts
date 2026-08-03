import express from "express";
import { accountController } from "../controllers/account.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth-middleware";

const routerAccount = express.Router();

routerAccount.post("/register-account", accountController.registerAccount);

routerAccount.get("/accounts", accountController.getAllAccounts);

routerAccount.get(
  "/accounts/actives",
  authMiddleware,
  accountController.getAllAccountsActives,
);

routerAccount.put(
  "/accounts/profile",
  authMiddleware,
  accountController?.updateAccount,
);

routerAccount.patch(
  "/accounts/delete/:accountId",
  authMiddleware,
  // roleMiddleware(["admin", "manager"]),
  accountController.acSoftDeleteAccount,
);

export default routerAccount;
