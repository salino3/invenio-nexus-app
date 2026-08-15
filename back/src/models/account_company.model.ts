import { QueryResult } from "pg";
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

  static async addCompanyRole(
    id: number,
    uuid: string,
    role: string,
  ): Promise<boolean> {
    const sql = `
    INSERT INTO account_companies (account_id, company_id, role)
    VALUES (
      $1,
      (SELECT id FROM companies WHERE uuid = $2),
      $3
    )
    ON CONFLICT (account_id, company_id) DO UPDATE 
    SET role = EXCLUDED.role;
  `;

    const result: QueryResult<any> = await query(sql, [id, uuid, role]);

    return (result.rowCount ?? 0) > 0;
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
