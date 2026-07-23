export type ContactsCompany = Array<{ type: string; value: string }>;

export type MultimediaCompany = Array<{
  title: string;
  type: string;
  file_url: string;
}>;

export interface CompanyProps {
  id: number;
  uuid: string;
  name: string;
  tax_id: string | null;
  description: string;
  hashtags?: string[]; // JSONB maps to array
  sector: string;
  location: string;
  country_code: string | null;
  funding_required_min: number | null;
  funding_required_max: number | null;
  ticket_investor_min: number | null;
  ticket_investor_max: number | null;
  connection_objectives: string[];
  contacts?: ContactsCompany;
  logo: string | null;
  multimedia: MultimediaCompany;
  created_at: Date;
  updated_at: Date;
}

// Interface for input data during registration
export interface RegistretionCompanyDB extends Omit<
  CompanyProps,
  "id" | "created_at" | "updated_at" | "uuid"
> {}

export interface RegistretionCompanyInput extends Pick<
  CompanyProps,
  keyof RegistretionCompanyDB
> {
  role: string;
}

// Interface update
export interface UpdateCompanyProps extends Omit<CompanyProps, "id" | "uuid"> {}
