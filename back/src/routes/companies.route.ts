import express from "express";
import { companiesController } from "../controllers/companies.controller";
import { authMiddleware } from "../middlewares/auth-middleware";
import { uploadLogo } from "../middlewares/upload.middleware";

const routerCompanies = express.Router();

routerCompanies.post(
  "/register-company",
  authMiddleware,
  uploadLogo.single("logo"),
  companiesController.registerCompany,
);

routerCompanies.post(
  "/search-companies",
  companiesController.getSearchingCompanies,
);

export default routerCompanies;
