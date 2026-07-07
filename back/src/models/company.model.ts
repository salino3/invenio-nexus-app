import {
  CompanyProps,
  ContactsCompany,
  MultimediaCompany,
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
}
