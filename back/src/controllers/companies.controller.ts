import { Response } from "express";
import { utilitiesApp } from "../utils/utilities-app";
import { RegistretionCompanyInput } from "../interfaces/company.interface";
import { Company } from "../models/company.model";
import { AuthRequest } from "../middlewares/auth-middleware";

const { checkRequiredFields } = utilitiesApp();

export class CompaniesController {
  //
  public async registerCompany(
    req: AuthRequest,
    res: Response,
  ): Promise<Response> {
    try {
      const company: RegistretionCompanyInput = req.body;

      const requiredFields = checkRequiredFields({
        name: company.name,
        description: company.description,
        sector: company.sector,
        location: company.location,
        role: company.role,
      });

      if (requiredFields.length > 0) {
        return res.status(400).json({
          error: `Missing fields:${requiredFields.map(
            (item: string) => ` ${item}`,
          )} ${requiredFields.length > 1 ? "are" : "is"} required.`,
        });
      }

      const authenticatedUserId: number | null = req.user ? req.user.id : null;

      if (!authenticatedUserId) {
        return res.status(401).json({
          error:
            "Unauthorized: Active user session is required to perform this action.",
        });
      }

      const { role, ...companyFields } = company;

      const newCompany = await Company.createCompanyWithAccount(
        companyFields,
        authenticatedUserId,
        role,
      );

      return res.status(201).json({
        message:
          "Company registered and role relationship linked successfully.",
        companyUuid: newCompany.uuid,
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
