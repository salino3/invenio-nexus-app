import express from "express";
import { companiesController } from "../controllers/companies.controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const routerCompanies = express.Router();

routerCompanies.post(
  "/register-company",
  authMiddleware,
  companiesController.registerCompany,
);

export default routerCompanies;
