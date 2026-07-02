import { query } from "../db";
import {
  AccountProps,
  AllAccounts,
  RegistretionAccountDB,
  UserRole,
} from "../interfaces/account.interface";

export class Account {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public age: number;
  public role_user: UserRole;
  public is_active: boolean;
  public created_at: Date;
  public updated_at: Date;
  public deleted_at?: Date | null;

  constructor(data: AccountProps) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.age = data.age;
    this.role_user = data.role_user || "user";
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
  }

  //
  static async createAccount(input: RegistretionAccountDB): Promise<Account> {
    const sql = `
      INSERT INTO accounts (name, email, password, age)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [input.name, input.email, input.password, input.age ?? null];

    const { rows } = await query(sql, values);

    return new Account(rows[0]);
  }

  //
  static async findActiveByEmail(email: string): Promise<Account | null> {
    const sql = `
      SELECT * FROM accounts 
      WHERE email = $1 AND is_active = true 
      LIMIT 1;
    `;
    const { rows } = await query(sql, [email]);
    if (rows.length === 0) return null;
    return new Account(rows[0]);
  }

  //
  static async retrieveAllAccounts(): Promise<AllAccounts[] | null> {
    const sql = `
      SELECT COALESCE(
     json_agg(to_jsonb(accounts) - '{password, created_at, updated_at, deleted_at}'::text[]), 
     '[]'::json
   ) AS accounts_list 
    FROM accounts;
 `;

    const { rows } = await query(sql);

    return rows;
  }
}
