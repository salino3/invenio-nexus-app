export const Theme = {
  dark: "dark",
  light: "light",
} as const;

// Derive the type from the object for use those values as types
export type ThemeEnum = (typeof Theme)[keyof typeof Theme];

export type UserRole = "admin" | "user" | "manager";

export interface PropsCurrentAccount {
  id?: number;
  email: string;
  name?: string;
  role_user?: UserRole;
  hasAdFreeAccess: boolean;
  exp: number | null;
  iat: number | null;
}

export interface MyCompaniesProps {
  uuid: string;
  name: string;
  logo: string;
}

export interface StateLoginDataAccount {
  user: PropsCurrentAccount;
  token?: string;
  success?: boolean;
  message?: string;
}

//
export interface AccountProps {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role_user: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface PropsProvider {
  currentUser: PropsCurrentAccount | null;
  myCompanies: MyCompaniesProps[];
  theme: ThemeEnum;
  configuration: boolean;
  setConfiguration(): void;
  setDataUser(data: PropsCurrentAccount | null): void;
  changeGlobalColors(): void;
}

// Company
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

export interface DataSearchedCompanies extends Omit<
  CompanyProps,
  "created_at" | "updated_at" | "id" | "tax_id"
> {}

export interface ResponseSearchedCompanies {
  data: DataSearchedCompanies[];
  success: boolean;
  total: number;
}
