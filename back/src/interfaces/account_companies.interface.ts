export type PermissionType = "owner" | "admin" | "member";

export interface AccountCompanyProps {
  account_id: number;
  company_id: number;
  role: string;
  permission: PermissionType;
  joined_at: Date;
}

export interface AccountCompanyAddRole extends Omit<
  AccountCompanyProps,
  "joined_at" | "company_id"
> {
  uuid: string;
  requesterId: number;
}

export interface AccountCompanyRole extends Pick<AccountCompanyProps, "role"> {
  name: string;
}
