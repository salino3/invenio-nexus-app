import bcrypt from "bcryptjs";
import { query } from "../db";
import {
  AccountCookie,
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
  static async createAccount(
    input: RegistretionAccountDB,
  ): Promise<Account | null> {
    const sql = `
      INSERT INTO accounts (name, email, password, age)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [input.name, input.email, input.password, input.age ?? null];

    //
    try {
      const { rows } = await query(sql, values);
      return new Account(rows[0]);
    } catch (error: any) {
      // Check for PostgreSQL unique violation error code (23505)
      if (error.code === "23505") {
        return null;
      }
      // Re-throw any other unpredictable database errors (e.g., connection issues)
      throw {
        error: "This email address is already active on another account.",
      };
    }
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
  static async retrieveAllAccounts(): Promise<AllAccounts[]> {
    const sql = `
      SELECT COALESCE(
     json_agg(to_jsonb(accounts) - '{password, created_at, updated_at, deleted_at}'::text[]), 
     '[]'::json
   ) AS accounts_list 
    FROM accounts;
 `;

    const { rows } = await query(sql);

    return rows[0]?.accounts_list ?? [];
  }

  //
  static async retrieveAllAccountsActives(): Promise<AllAccounts[]> {
    const sql = `
    SELECT COALESCE(
      json_agg(to_jsonb(accounts) - '{password, created_at, updated_at, deleted_at}'::text[]), 
      '[]'::json
    ) AS accounts_list 
    FROM accounts
    WHERE is_active = true;
  `;

    const { rows } = await query(sql);

    return rows[0]?.accounts_list ?? [];
  }

  // Auth Acoount
  static async loginAccount(
    email: string,
    password_plain: string,
  ): Promise<AccountCookie> {
    const sql = `SELECT * FROM accounts WHERE email = $1 AND is_active = true`;
    const result = await query(sql, [email]);

    const user = result.rows[0];

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password_plain, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const hasAdFreeAccess: boolean =
      await Account.checkSubscriptionStatusByUser(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role_user: user.role_user,
      hasAdFreeAccess,
    };
  }

  //
  static async checkSubscriptionStatusByUser(userId: number): Promise<boolean> {
    // Check active subscription status in database
    const subscriptionQuery = `
      SELECT id 
      FROM subscriptions 
      WHERE account_id = $1 
        AND current_period_end > now()
        AND status = 'active'
      LIMIT 1
    `;

    const subResult = await query(subscriptionQuery, [userId]);

    return subResult.rows.length > 0;
  }
}
