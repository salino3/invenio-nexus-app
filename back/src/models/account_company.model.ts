import { QueryResult } from "pg";
import { query } from "../db";
import {
  AccountCompanyAddRole,
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

  static async addCompanyRole(
    data: AccountCompanyAddRole,
  ): Promise<{ success: boolean; reason?: string }> {
    const { requesterId, account_id, uuid, role, permission } = data;

    const sql = `
  INSERT INTO account_companies (account_id, company_id, role, permission)
    SELECT 
      $1::integer, 
      c.id, 
      $2::varchar, 
      $3::company_permission
    FROM companies c
    JOIN account_companies ac ON ac.company_id = c.id
    WHERE c.uuid = $4
      AND ac.account_id = $5
      AND ac.permission IN ('owner', 'admin')
    ON CONFLICT (account_id, company_id) DO UPDATE 
    SET role = EXCLUDED.role,
        permission = EXCLUDED.permission;
  `;

    const values = [
      account_id, // $1: Target User
      role, // $2: Role
      permission, // $3: Permission level
      uuid, // $4: UUID company
      requesterId, // $5: Logged in account making the request
    ];

    const result: QueryResult<any> = await query(sql, values);

    if ((result.rowCount ?? 0) === 0) {
      return {
        success: false,
        reason:
          "FORBIDDEN: Only company owners or admins can manage roles or invalid company UUID.",
      };
    }

    return { success: true };
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

  //
  static async updateRoleCompanyByUUID(
    role: string,
    accountId: number,
    uuidCompany: string,
  ): Promise<boolean> {
    const sql = `
    UPDATE account_companies ac
    SET role = $1
    FROM companies c
    WHERE ac.company_id = c.id
      AND ac.account_id = $2
      AND c.uuid = $3;
  `;
    const result = await query(sql, [role, accountId, uuidCompany]);

    return (result.rowCount ?? 0) > 0;
  }

  //
  static async deleteRoleCompanyByUUID(
    accountId: number,
    uuidCompany: string,
  ): Promise<boolean> {
    const sql = `
     DELETE FROM account_companies ac  
     USING companies c
        WHERE ac.company_id = c.id
      AND ac.account_id = $1
      AND c.uuid = $2;
    `;

    const result = await query(sql, [accountId, uuidCompany]);

    return (result.rowCount || 0) > 0;
  }
}
