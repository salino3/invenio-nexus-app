import express from "express";
import { companiesController } from "../controllers/companies.controller";

const routerCompanies = express.Router();

routerCompanies.post("/register-company", companiesController.registerCompany);

export default routerCompanies;
