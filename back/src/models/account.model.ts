import bcrypt from "bcryptjs";
import { query } from "../db";
import {
  AccountCookie,
  AccountProps,
  AllAccounts,
  RegistretionAccountDB,
  UserRole,
} from "../interfaces/account.interface";
import { QueryResult } from "pg";

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

  //
  static async checkAccountAndEmailAvailability(
    id: number,
    newEmail?: string,
  ): Promise<{ currentUser: AccountProps | null; isEmailTaken: boolean }> {
    const sql = `
      SELECT 
        id, name, email, age,
        EXISTS(
          SELECT 1 FROM accounts 
          WHERE email = $2 AND id != $1 AND is_active = true
        ) AS is_email_taken
      FROM accounts 
      WHERE id = $1 AND is_active = true
    `;

    const { rows } = await query(sql, [id, newEmail || null]);

    if (rows.length === 0) {
      return { currentUser: null, isEmailTaken: false };
    }

    return {
      currentUser: rows[0],
      isEmailTaken: Boolean(rows[0].is_email_taken),
    };
  }

  //
  static async updateAccount(
    setClauses: string[] = [],
    paramCount: number,
    valuesToUpdate: Partial<Account>[] = [],
  ): Promise<QueryResult<Account>> {
    const sql = `
        UPDATE accounts
        SET ${setClauses.join(", ")}, updated_at = NOW()
        WHERE id = $${paramCount} AND is_active = true
        RETURNING id, name, email, age, role_user, updated_at
      `;

    return await query(sql, valuesToUpdate);
  }

  //
  static async getAccountWithSubscription(id: number): Promise<AccountCookie> {
    const sql = `
         SELECT 
       a.id,
       a.name,
       a.email,
       a.role_user,
       COALESCE(
         s.status = 'active' AND s.current_period_end > NOW(), 
         false
       ) AS "hasAdFreeAccess"
     FROM accounts a
     LEFT JOIN subscriptions s ON a.id = s.account_id
     WHERE a.id = $1;
    `;

    const result = await query(sql, [id]);

    return result.rows[0] || null;
  }

  //
  static async querySoftDeleteAccount(id: number): Promise<boolean> {
    const sql = `
    UPDATE accounts SET is_active = false WHERE id = $1;
   `;

    const result = await query(sql, [id]);

    return (result.rowCount || 0) > 0;
  }

  //
  static async queryHardDeleteAccount(id: number): Promise<boolean> {
    const sql = `
    DELETE FROM accounts WHERE id = $1;
   `;

    const result = await query(sql, [id]);

    return (result.rowCount || 0) > 0;
  }

  //
  static async temporaryPassword(
    hashedToken: string,
    email: string,
  ): Promise<QueryResult> {
    const sql = `
      UPDATE accounts
      SET 
        reset_password_token = $1,
        reset_password_expires = NOW() + INTERVAL '15 minutes',
        updated_at = NOW()
      WHERE email = $2 AND is_active = true AND deleted_at IS NULL
      RETURNING id;
    `;

    return await query(sql, [hashedToken, email]);
  }

  //
  static async resetingPasswordToken(
    hashedPassword: string,
    hashedToken: string,
  ) {
    const sql = `
      UPDATE accounts
      SET 
        password = $1,
        reset_password_token = NULL,
        reset_password_expires = NULL,
        updated_at = NOW()
      WHERE reset_password_token = $2 
        AND reset_password_expires > NOW()
        AND is_active = true 
        AND deleted_at IS NULL
      RETURNING id, email;
    `;

    return await query(sql, [hashedPassword, hashedToken]);
  }
}
