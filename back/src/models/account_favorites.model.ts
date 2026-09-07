// models/account-favorite.model.ts

import { query } from "../db";
import { QueryResult } from "pg";
import { AccountFavoritesProps } from "../interfaces/account_favorites.interface";

export class AccountFavorites {
  public account_id: number;
  public company_uuid: string;
  public created_at: Date;

  constructor(data: AccountFavoritesProps) {
    this.account_id = data.account_id;
    this.company_uuid = data.company_uuid;
    this.created_at = data.created_at;
  }
}
