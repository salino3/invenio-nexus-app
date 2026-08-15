import express from "express";
import { accountCompaniesController } from "../controllers/account_companies.controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const routerAccountCompanies = express.Router();

//* Create role in route "/register-company"
routerAccountCompanies.post(
  "/roles-company",
  authMiddleware,
  accountCompaniesController.addRoleCompany,
);

routerAccountCompanies.patch(
  "/roles-company/:uuidCompany",
  authMiddleware,
  accountCompaniesController.updateRoleCompany,
);

routerAccountCompanies.delete(
  "/roles-company/:uuidCompany",
  authMiddleware,
  accountCompaniesController.deleteRoleCompany,
);

export default routerAccountCompanies;
