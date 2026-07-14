import { Request, Response } from "express";
import { utilitiesApp } from "../utils/utilities-app";
import {
  RegistretionCompanyDB,
  RegistretionCompanyInput,
} from "../interfaces/company.interface";
import { Company } from "../models/company.model";
import { AuthRequest } from "../middlewares/auth-middleware";

const { checkRequiredFields } = utilitiesApp();

// Helper to safely parse JSON strings sent via multipart form data
const safeJsonParse = <T>(value: any, defaultValue: T): T => {
  if (!value) return defaultValue;
  if (typeof value === "object") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
};

// Helper to parse numeric values from string body
const parseNumber = (value: any): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
};

export class CompaniesController {
  //
  public async registerCompany(req: Request, res: Response): Promise<Response> {
    try {
      const authenticatedUserId: number | null =
        (req as AuthRequest).user?.id ?? null;

      if (!authenticatedUserId) {
        return res.status(401).json({
          error:
            "Unauthorized: Active user session is required to perform this action.",
        });
      }

      const body = req.body;

      // Validate core required text fields
      const requiredFields = checkRequiredFields({
        name: body.name,
        description: body.description,
        sector: body.sector,
        location: body.location,
        role: body.role,
      });

      if (requiredFields.length > 0) {
        return res.status(400).json({
          error: `Missing fields:${requiredFields.map(
            (item: string) => ` ${item}`,
          )} ${requiredFields.length > 1 ? "are" : "is"} required.`,
        });
      }

      // Handle uploaded logo file path if present
      const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;

      // Extract and map all parameters cleanly to match RegistretionCompanyDB
      const companyInputData: RegistretionCompanyDB = {
        name: body.name,
        tax_id: body.tax_id || null,
        description: body.description,
        hashtags: safeJsonParse<string[]>(body.hashtags, []),
        sector: body.sector,
        location: body.location,
        country_code: body.country_code || null,
        funding_required_min: parseNumber(body.funding_required_min),
        funding_required_max: parseNumber(body.funding_required_max),
        ticket_investor_min: parseNumber(body.ticket_investor_min),
        ticket_investor_max: parseNumber(body.ticket_investor_max),
        connection_objectives: safeJsonParse<string[]>(
          body.connection_objectives,
          [],
        ),
        contacts: safeJsonParse(body.contacts, []),
        logo: logoUrl,
        multimedia: [], // Multimedia handled separately in a dedicated endpoint
      };

      const newCompany = await Company.createCompanyWithAccount(
        companyInputData,
        authenticatedUserId,
        body.role,
      );

      return res.status(201).json({
        message:
          "Company registered and role relationship linked successfully.",
        companyUuid: newCompany.uuid,
        logo: newCompany.logo,
      });
    } catch (error: unknown) {
      console.error(
        "Critical error inside CompaniesController.registerCompany:",
        error,
      );
      return res.status(500).json({
        error:
          "An internal server error occurred while processing your registration.",
      });
    }
  }
}

export const companiesController = new CompaniesController();
