import { Request, Response } from "express";
import { query } from "../db";
import { Company } from "../models/company.model";
import { AccountCompany } from "../models/account_company.model";
import { AuthRequest } from "../middlewares/auth-middleware";
import { utilitiesApp } from "../utils/utilities-app";
import {
  CompanyProps,
  RegistretionCompanyDB,
  UpdateCompanyProps,
} from "../interfaces/company.interface";
import { AccountCompanyRole } from "../interfaces/account_companies.interface";

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
const parseNumber = (
  value: string | number | null | undefined,
): number | null => {
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

  public async getCompanyByUUID(
    req: Request,
    res: Response,
  ): Promise<
    Response<{ company: CompanyProps; roles?: AccountCompanyRole[] }>
  > {
    const { uuidCompany } = req.params;

    try {
      if (!uuidCompany) {
        return res.status(400).send("The Company's UUID is missing.");
      }

      const company: CompanyProps | null = await Company.getCompanyWithUUID(
        uuidCompany as string,
      );

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const roles: AccountCompanyRole[] =
        await AccountCompany.getCompanyRolesByUUID(uuidCompany as string);

      if (roles.length === 0) {
        return res.status(200).json({ company });
      }

      return res.status(200).json({ company, roles });
    } catch (error: unknown) {
      console.error(
        "Critical error inside CompaniesController.getCompanyById:",
        error,
      );
      return res.status(500).json({
        error: "An internal server error occurred during the process.",
      });
    }
  }

  /**
   * Search companies using key-term weight scoring and optimized indexing.
   * Relevancy Weighting: Name (High) > Sector (Medium) > Hashtags (Low)
   * Standard industry Dis_Max (Greatest field + 10% tie-breaker) to avoid false positives.
   */
  public async getSearchingCompanies(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { searching, offset = 0 } = req.body;
    const limit: number = 30;
    // 1. Basic validation

    if (searching && typeof searching !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid searching query" });
    }

    if (!searching && typeof searching === "string") {
      const { rows: companies } = await query(
        `SELECT * FROM companies LIMIT ${limit};`,
      );

      return res.status(200).json({
        success: true,
        data: companies,
        offset: parseInt(offset, 10),
        total: companies.length ?? 0,
        limit,
      });
    }

    const parsedOffset = parseInt(offset, 10);
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({ error: "Invalid offset value" });
    }

    try {
      // 2. Clean up search terms and split by whitespace/commas
      const keywords: string[] = searching
        .split(/[\s,]+/)
        .map((term: string) => term.trim().toLowerCase())
        .filter((term: string) => term.length > 0);

      if (keywords.length === 0) {
        return res
          .status(400)
          .json({ error: "Search query contains no valid terms" });
      }

      const queryParams: string[] = [];
      const whereClauses: string[] = [];
      const scoreClauses: string[] = [];

      /**
       * 3. Dynamically build the SQL Query components
       */
      keywords.forEach((keyword: string) => {
        const containsPlaceholderIndex = queryParams.length + 1; // p.ej. $1
        queryParams.push(`%${keyword}%`);

        const prefixPlaceholderIndex = queryParams.length + 1; // p.ej. $2
        queryParams.push(`${keyword}%`);

        whereClauses.push(`
        (LOWER(name) LIKE $${containsPlaceholderIndex} OR 
         LOWER(sector) LIKE $${containsPlaceholderIndex} OR 
         (hashtags::text) ILIKE $${containsPlaceholderIndex})
      `);

        // SCORE: Dis_Max (Greatest + 10% Tie Breaker) COALESCE for security
        scoreClauses.push(`
        COALESCE(
          (
            GREATEST(
              CASE WHEN LOWER(name) LIKE $${prefixPlaceholderIndex} THEN 100 
                   WHEN LOWER(name) LIKE $${containsPlaceholderIndex} THEN 60 ELSE 0 END,
              CASE WHEN LOWER(sector) LIKE $${prefixPlaceholderIndex} THEN 50 
                   WHEN LOWER(sector) LIKE $${containsPlaceholderIndex} THEN 30 ELSE 0 END,
              CASE WHEN (hashtags::text) ILIKE $${containsPlaceholderIndex} THEN 10 ELSE 0 END
            ) 
            + 
            (0.1 * (
              CASE WHEN LOWER(name) LIKE $${prefixPlaceholderIndex} THEN 100 
                   WHEN LOWER(name) LIKE $${containsPlaceholderIndex} THEN 60 ELSE 0 END +
              CASE WHEN LOWER(sector) LIKE $${prefixPlaceholderIndex} THEN 50 
                   WHEN LOWER(sector) LIKE $${containsPlaceholderIndex} THEN 30 ELSE 0 END +
              CASE WHEN (hashtags::text) ILIKE $${containsPlaceholderIndex} THEN 10 ELSE 0 END
            ))
          ), 0
        )
      `);
      });

      // Configuración de Paginación
      const limit = 30;
      const offsetPlaceholderIndex = queryParams.length + 1;
      queryParams.push(String(parsedOffset));

      // Unir múltiples palabras clave con AND (fuerza a que coincidan todos los términos ingresados)
      const sqlWhereClause = whereClauses.join(" AND ");
      const sqlScoreFormula = scoreClauses.join(" + ");

      // 4. Assemble the complete optimized SQL query
      const sqlQuery = `
      SELECT        
        uuid, 
        name, 
        sector, 
        location, 
        description,
        logo, 
        hashtags, 
        connection_objectives, 
        contacts,
        multimedia,
        country_code,
        funding_required_min,
        funding_required_max,
        ticket_investor_min,
        ticket_investor_max,
        (${sqlScoreFormula}) AS relevance_score
      FROM companies
      WHERE ${sqlWhereClause}
      ORDER BY relevance_score DESC, name ASC
      LIMIT ${limit} OFFSET $${offsetPlaceholderIndex};
    `;

      // 5. Execute query
      const { rows: companies } = await query(sqlQuery, queryParams);

      return res.status(200).json({
        success: true,
        data: companies,
        offset: parsedOffset,
        total: companies.length ?? 0,
        limit,
      });
    } catch (error) {
      console.error("Error executing getSearchingCompanies query:", error);
      return res
        .status(500)
        .json({ error: "Internal server error during search" });
    }
  }

  // 'role' it will be modified in another endpoint
  public async updateCompanyByUUID(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { uuidCompany } = req.params;

    const {
      name,
      tax_id,
      description,
      hashtags,
      sector,
      location,
      country_code,
      funding_required_min,
      funding_required_max,
      ticket_investor_min,
      ticket_investor_max,
      connection_objectives,
      contacts,
      logo,
      multimedia,
    }: UpdateCompanyProps = req.body;

    return res;
  }
}

export const companiesController = new CompaniesController();
