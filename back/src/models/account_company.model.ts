import { query } from "../db";
import {
  AccountCompanyProps,
  AccountCompanyRole,
} from "../interfaces/account_companies.interface";

export class AccountCompany {
  public account_id: number;
  public company_id: number;
  public role: string;
  public joined_at: Date;

  constructor(data: AccountCompanyProps) {
    this.account_id = data.account_id;
    this.company_id = data.company_id;
    this.role = data.role;
    this.joined_at = data.joined_at;
  }

  static async getCompanyRolesByUUID(
    uuidCompany: string,
  ): Promise<AccountCompanyRole[]> {
    const sql = `
      SELECT 
        a.name, 
        ac.role
      FROM accounts a
      JOIN account_companies ac ON a.id = ac.account_id
      JOIN companies c ON c.id = ac.company_id
      WHERE c.uuid = $1 AND a.is_active = true;
    `;

    const result = await query(sql, [uuidCompany]);

    return result.rows ?? [];
  }
}
