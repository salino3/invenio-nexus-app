import express from "express";
import { companiesController } from "../controllers/companies.controller";
import { authMiddleware } from "../middlewares/auth-middleware";
import { uploadCompanyAssets } from "../middlewares/multimedia-upload.middleware";

const routerCompanies = express.Router();

routerCompanies.post(
  "/register-company",
  authMiddleware,
  uploadCompanyAssets,
  companiesController.registerCompany,
);

routerCompanies.get(
  "/get-company/:uuidCompany",
  authMiddleware,
  companiesController.getCompanyByUUID,
);

routerCompanies.post(
  "/search-companies",
  authMiddleware,
  companiesController.getSearchingCompanies,
);

routerCompanies.put(
  "/update-company/:uuidCompany",
  uploadCompanyAssets,
  companiesController.updateCompanyByUUID,
);

export default routerCompanies;
