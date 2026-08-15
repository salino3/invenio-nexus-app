import { Request, Response } from "express";
import { query } from "../db";
import { Company } from "../models/company.model";
import { AccountCompany } from "../models/account_company.model";
import { AuthRequest } from "../middlewares/auth-middleware";
import { utilitiesApp } from "../utils/utilities-app";
import {
  CompanyProps,
  ListMyCompanies,
  RegistretionCompanyDB,
  UpdateCompanyProps,
} from "../interfaces/company.interface";
import { AccountCompanyRole } from "../interfaces/account_companies.interface";

const { checkRequiredFields, cleanupUploadedFiles } = utilitiesApp();

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
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    try {
      const authenticatedUserId: number | null =
        (req as AuthRequest).user?.id ?? null;

      if (!authenticatedUserId) {
        cleanupUploadedFiles(files); // 🧹 Cleanup if unauthorized
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
        cleanupUploadedFiles(files);
        return res.status(400).json({
          error: `Missing fields:${requiredFields.map(
            (item: string) => ` ${item}`,
          )} ${requiredFields.length > 1 ? "are" : "is"} required.`,
        });
      }

      // 1. Handle Logo from req.files
      const logoFile = files?.["logo"]?.[0];
      const logoUrl = logoFile ? `/uploads/${logoFile.filename}` : null;

      // 2. Handle Multimedia Files
      const uploadedMediaFiles = files?.["multimedia_files"] || [];
      let parsedMultimedia: any[] = [];

      if (body.multimedia) {
        const parsed = safeJsonParse<any[] | null>(body.multimedia, null);

        if (parsed === null || !Array.isArray(parsed)) {
          cleanupUploadedFiles(files);
          return res
            .status(400)
            .json({ error: "Invalid JSON format in 'multimedia' field" });
        }

        parsedMultimedia = parsed.map((item) => {
          if (
            typeof item.fileIndex === "number" &&
            uploadedMediaFiles[item.fileIndex]
          ) {
            const uploadedFile = uploadedMediaFiles[item.fileIndex];
            return {
              title: item.title,
              type: item.type,
              file_url: `/uploads/${uploadedFile.filename}`,
            };
          }
          return {
            title: item.title,
            type: item.type,
            file_url: item.file_url,
          };
        });
      }

      // Extract and map all parameters cleanly
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
        multimedia: parsedMultimedia, // Saved mapped multimedia array!
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
      cleanupUploadedFiles(files);
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

  async getMyCompaniesByID(
    req: Request,
    res: Response,
  ): Promise<Response<ListMyCompanies[]>> {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("The Account's ID is missing.");
    }

    try {
      const companies: ListMyCompanies[] =
        await Company.getMyCompaniesByAccountID(Number(id));

      return res.status(200).json(companies);
    } catch (error: unknown) {
      console.error(
        "Critical error inside CompaniesController.getMyCompaniesByID:",
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
        total: companies.length ?? 0,
        // offset: parseInt(offset, 10),
        // limit,
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
        total: companies.length ?? 0,
        // offset: parsedOffset,
        // limit,
      });
    } catch (error) {
      console.error("Error executing getSearchingCompanies query:", error);
      return res
        .status(500)
        .json({ error: "Internal server error during search" });
    }
  }

  // 'role' will be modified in another endpoint
  public async updateCompanyByUUID(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { uuidCompany } = req.params;

    // Extract files early so we can clean them up if needed
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    if (!uuidCompany) {
      cleanupUploadedFiles(files); // 🧹 Cleanup orphan files
      return res.status(400).send("Missing company UUID");
    }

    try {
      const body = req.body;

      // Process Logo
      const logoFile = files?.["logo"]?.[0];
      const logoUrl = logoFile ? `/uploads/${logoFile.filename}` : body.logo;

      // Process Multimedia Files
      const uploadedMediaFiles = files?.["multimedia_files"] || [];
      let parsedMultimedia: any[] | undefined = undefined;

      // 1. Only attempt parsing if 'multimedia' key was explicitly sent in body
      if (body.multimedia !== undefined) {
        // Use `null` as the fallback if JSON parsing fails
        const parsed = safeJsonParse<any[] | null>(body.multimedia, null);

        // 🚨 Guard: If invalid JSON was sent (e.g. missing comma), abort immediately!
        if (parsed === null || !Array.isArray(parsed)) {
          cleanupUploadedFiles(files);
          return res
            .status(400)
            .send("Invalid JSON format in 'multimedia' field");
        }

        // 2. Map files and fileIndex pointers
        parsedMultimedia = parsed.map((item) => {
          if (
            typeof item.fileIndex === "number" &&
            uploadedMediaFiles[item.fileIndex]
          ) {
            const uploadedFile = uploadedMediaFiles[item.fileIndex];
            return {
              title: item.title,
              type: item.type,
              file_url: `/uploads/${uploadedFile.filename}`,
            };
          }
          return {
            title: item.title,
            type: item.type,
            file_url: item.file_url,
          };
        });
      }

      // Body validation checks
      const name = body.name;
      const tax_id = body.tax_id ?? null;
      const description = body.description;
      const sector = body.sector;
      const location = body.location;
      const country_code = body.country_code ?? null;
      const funding_required_min = parseNumber(body.funding_required_min);
      const funding_required_max = parseNumber(body.funding_required_max);
      const ticket_investor_min = parseNumber(body.ticket_investor_min);
      const ticket_investor_max = parseNumber(body.ticket_investor_max);

      const hashtags = safeJsonParse<string[] | undefined>(
        body.hashtags,
        undefined,
      );
      const connection_objectives = safeJsonParse<string[] | undefined>(
        body.connection_objectives,
        undefined,
      );
      const contacts = safeJsonParse<any[] | undefined>(
        body.contacts,
        undefined,
      );

      // 🛑 VALIDATION CHECK: If required fields fail, clean up files and exit!
      if (!name || !description || !sector || !location || !contacts) {
        cleanupUploadedFiles(files);
        return res.status(400).send("Missing required field(s)");
      }

      // Build Dynamic SQL UPDATE Query
      const updates: Partial<Record<keyof UpdateCompanyProps, string>> = {};
      const values: any[] = [];
      let paramCount: number = 1;

      if (name !== undefined) {
        updates.name = `$${paramCount++}`;
        values.push(name);
      }
      if (tax_id !== undefined) {
        updates.tax_id = `$${paramCount++}`;
        values.push(tax_id);
      }
      if (description !== undefined) {
        updates.description = `$${paramCount++}`;
        values.push(description);
      }
      if (hashtags !== undefined) {
        updates.hashtags = `$${paramCount++}::jsonb`;
        values.push(JSON.stringify(hashtags));
      }
      if (sector !== undefined) {
        updates.sector = `$${paramCount++}`;
        values.push(sector);
      }
      if (location !== undefined) {
        updates.location = `$${paramCount++}`;
        values.push(location);
      }
      if (country_code !== undefined) {
        updates.country_code = `$${paramCount++}`;
        values.push(country_code);
      }
      if (funding_required_min !== undefined) {
        updates.funding_required_min = `$${paramCount++}`;
        values.push(funding_required_min);
      }
      if (funding_required_max !== undefined) {
        updates.funding_required_max = `$${paramCount++}`;
        values.push(funding_required_max);
      }
      if (ticket_investor_min !== undefined) {
        updates.ticket_investor_min = `$${paramCount++}`;
        values.push(ticket_investor_min);
      }
      if (ticket_investor_max !== undefined) {
        updates.ticket_investor_max = `$${paramCount++}`;
        values.push(ticket_investor_max);
      }
      if (connection_objectives !== undefined) {
        updates.connection_objectives = `$${paramCount++}`;
        values.push(`{${connection_objectives.join(",")}}`);
      }
      if (contacts !== undefined) {
        updates.contacts = `$${paramCount++}::jsonb`;
        values.push(JSON.stringify(contacts));
      }
      // This validation protect existing data: if the key isn't sent in the request,
      // the database column remains untouched.
      if (parsedMultimedia !== undefined) {
        updates.multimedia = `$${paramCount++}::jsonb`;
        values.push(JSON.stringify(parsedMultimedia));
      }
      if (logoUrl !== undefined) {
        updates.logo = `$${paramCount++}`;
        values.push(logoUrl);
      }

      if (Object.keys(updates).length === 0) {
        cleanupUploadedFiles(files);
        return res.status(200).send("No fields to update");
      }

      const setClauses = Object.entries(updates)
        .map(([key, value]) => `${key} = ${value}`)
        .join(", ");

      const sql = `
      UPDATE companies
      SET ${setClauses}, updated_at = NOW()
      WHERE uuid = $${paramCount}
    `;

      values.push(uuidCompany);

      const result = await query(sql, values);

      if (result.rowCount === 0) {
        cleanupUploadedFiles(files);
        return res
          .status(404)
          .send(`Company with UUID ${uuidCompany} not found`);
      }

      return res
        .status(200)
        .send(`Company with UUID ${uuidCompany} updated successfully`);
    } catch (error) {
      cleanupUploadedFiles(files);
      console.error("Error executing updateCompanyByUUID endpoint:", error);
      return res
        .status(500)
        .json({ error: "Internal server error during update" });
    }
  }
}

export const companiesController = new CompaniesController();
