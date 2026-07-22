export interface AccountCompanyProps {
  account_id: number;
  company_id: number;
  role: string;
  joined_at: Date;
}

export interface AccountCompanyRole extends Pick<AccountCompanyProps, "role"> {
  name: string;
}
