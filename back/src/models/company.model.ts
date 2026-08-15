import { query } from "../db";
import {
  CompanyProps,
  ContactsCompany,
  ListMyCompanies,
  MultimediaCompany,
  RegistretionCompanyDB,
} from "../interfaces/company.interface";

//
const parseDecimal = (
  value: string | number | null | undefined,
): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return typeof value === "number" ? value : parseFloat(value);
};

export class Company {
  public id: number;
  public uuid: string;
  public name: string;
  public tax_id: string | null;
  public description: string;
  public hashtags: string[];
  public sector: string;
  public location: string;
  public country_code: string | null;

  // Decimal fields parsed to numbers
  public funding_required_min: number | null;
  public funding_required_max: number | null;
  public ticket_investor_min: number | null;
  public ticket_investor_max: number | null;

  public connection_objectives: string[];
  public contacts: ContactsCompany;
  public logo: string | null;
  public multimedia: MultimediaCompany;
  public created_at: Date;
  public updated_at: Date;

  constructor(data: CompanyProps) {
    this.id = data.id;
    this.uuid = data.uuid;
    this.name = data.name;
    this.tax_id = data.tax_id || null;
    this.description = data.description;

    // JSONB safety fallback
    this.hashtags = Array.isArray(data.hashtags) ? data.hashtags : [];
    this.sector = data.sector;
    this.location = data.location;
    this.country_code = data.country_code || null;

    // CRITICAL: Parse DB string decimals to JS numbers safely
    this.funding_required_min = parseDecimal(data.funding_required_min);
    this.funding_required_max = parseDecimal(data.funding_required_max);
    this.ticket_investor_min = parseDecimal(data.ticket_investor_min);
    this.ticket_investor_max = parseDecimal(data.ticket_investor_max);

    this.connection_objectives = Array.isArray(data.connection_objectives)
      ? data.connection_objectives
      : [];
    this.contacts = Array.isArray(data.contacts) ? data.contacts : [];
    this.logo = data.logo || null;
    this.multimedia = Array.isArray(data.multimedia) ? data.multimedia : [];

    this.created_at = new Date(data.created_at);
    this.updated_at = new Date(data.updated_at);
  }

  /**
   * Creates a company profile and registers the creator relation within a safe transaction.
   * @param input Purified company database fields
   * @param accountId The authenticated member ID from JWT session
   * @param role The member's specific structural role inside this company
   */
  static async createCompanyWithAccount(
    input: RegistretionCompanyDB,
    accountId: number,
    role: string,
  ): Promise<Company> {
    // Begin transaction block to prevent orphan/partial records
    await query("BEGIN");

    try {
      // 1. Insert core profile data into companies table
      const companySql = `
        INSERT INTO companies (
          name, tax_id, description, hashtags, sector, location, country_code,
          funding_required_min, funding_required_max, 
          ticket_investor_min, ticket_investor_max,
          connection_objectives, contacts, logo, multimedia
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, 
          $8, $9, 
          $10, $11, 
          $12, $13, $14, $15
        )
        RETURNING *;
      `;

      const companyValues = [
        input.name,
        input.tax_id ?? null,
        input.description,
        JSON.stringify(input.hashtags ?? []),
        input.sector,
        input.location,
        input.country_code ?? null,
        input.funding_required_min ?? null,
        input.funding_required_max ?? null,
        input.ticket_investor_min ?? null,
        input.ticket_investor_max ?? null,
        input.connection_objectives ?? [],
        JSON.stringify(input.contacts ?? []),
        input.logo ?? null,
        JSON.stringify(input.multimedia ?? []),
      ];

      const { rows: companyRows } = await query(companySql, companyValues);
      const newCompanyData: CompanyProps = companyRows[0];

      // 2. Insert relationship into junction table using the dynamic role variable
      const relationSql = `
        INSERT INTO account_companies (account_id, company_id, role)
        VALUES ($1, $2, $3);
      `;

      const relationValues = [accountId, newCompanyData.id, role];
      await query(relationSql, relationValues);

      // Save database changes permanently
      await query("COMMIT");

      // By data from DB fixing all types parameters automatically
      return new Company(newCompanyData);
    } catch (error) {
      // Revert any single query change if any statement crashes
      await query("ROLLBACK");
      throw error;
    }
  }

  static async getCompanyWithUUID(
    uuidCompany: string,
  ): Promise<CompanyProps | null> {
    const sql = `SELECT * FROM companies WHERE uuid = $1`;

    const result = await query(sql, [uuidCompany]);

    if (!result.rows[0]) {
      return null;
    }

    const companyRows: CompanyProps = result.rows[0];

    return new Company(companyRows);
  }

  static async getMyCompaniesByAccountID(
    id: number,
  ): Promise<ListMyCompanies[]> {
    const sql = `
    SELECT c.name, c.UUID, c.logo
    FROM companies c
    JOIN account_companies ac ON c.id = ac.company_id
    WHERE ac.account_id = $1;  
     `;

    const result = await query(sql, [id]);

    return result.rows;
  }
}
