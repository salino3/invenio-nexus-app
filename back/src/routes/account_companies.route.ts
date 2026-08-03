import express from "express";
import { accountCompaniesController } from "../controllers/account_companies.controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const routerAccountCompanies = express.Router();

routerAccountCompanies.patch(
  "/roles-company/:uuidCompany",
  authMiddleware,
  accountCompaniesController.updateRoleCompany,
);

routerAccountCompanies.delete(
  "/roles-company/:uuidCompany",
  accountCompaniesController.deleteRoleCompany,
);

export default routerAccountCompanies;
