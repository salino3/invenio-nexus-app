import { query } from "../db";
import {
  CompanyProps,
  ContactsCompany,
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

  //
  static async createCompany(input: RegistretionCompanyDB): Promise<Company> {
    const sql = `
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
      RETURNING id;
    `;

    const values = [
      input.name,
      input.tax_id ?? null,
      input.description,
      JSON.stringify(input.hashtags ?? []), // JSONB fields require stringification or structured passing depending on driver config
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

    const { rows } = await query(sql, values);

    return new Company(rows[0]);
  }
}
