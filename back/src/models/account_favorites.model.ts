import { query } from "../db";
import { QueryResult } from "pg";
import {
  AccountFavoritesProps,
  AccountFavoritesResponse,
} from "../interfaces/account_favorites.interface";

export class AccountFavorites {
  public account_id: number;
  public company_uuid: string;
  public created_at: Date;

  constructor(data: AccountFavoritesProps) {
    this.account_id = data.account_id;
    this.company_uuid = data.company_uuid;
    this.created_at = data.created_at;
  }

  static async insertFavoriteCompany(
    accountId: number,
    companyUUID: string,
  ): Promise<AccountFavoritesResponse[]> {
    // 1 single SQL query without 'ON CONFLICT DO NOTHING'
    // so Postgres triggers the unique primary key constraint if it exists
    const sql = `
        INSERT INTO account_favorites (account_id, company_uuid)
        SELECT $1, c.uuid
        FROM companies c
        WHERE c.uuid = $2
        RETURNING account_id, company_uuid, created_at;
      `;

    const { rows } = await query(sql, [accountId, companyUUID]);

    return rows;
  }
}
