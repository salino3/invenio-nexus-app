import { Request, Response } from "express";
import { utilitiesApp } from "../utils/utilities-app";
import { RegistretionCompanyInput } from "../interfaces/company.interface";
import { Company } from "../models/company.model";

const { checkRequiredFields } = utilitiesApp();

export class CompaniesController {
  //
  public async registerCompany(req: Request, res: Response): Promise<Response> {
    try {
      const company: RegistretionCompanyInput = req.body;

      const requiredFields = checkRequiredFields({
        name: company.name,
        description: company.description,
        sector: company.sector,
        location: company.location,
      });

      if (requiredFields.length > 0) {
        return res.status(400).json({
          error: `Missing fields:${requiredFields.map(
            (item: string) => ` ${item}`,
          )} ${requiredFields.length > 1 ? "are" : "is"} required.`,
        });
      }

      await Company.createCompany(company);

      return res.status(201).json({
        message: "Company registered successfully.",
      });
    } catch (error: unknown) {
      console.error("Critical error inside AuthController.register:", error);
      return res.status(500).json({
        error:
          "An internal server error occurred while processing your registration.",
      });
    }
  }
}

export const companiesController = new CompaniesController();
