import { QueryDB } from "../interfaces/app.interface";
import {
  AccountProps,
  CreateAccountInput,
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
    dbQuery: QueryDB,
    input: CreateAccountInput,
  ): Promise<Account> {
    const query = `
      INSERT INTO accounts (name, email, password, age)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      input.name,
      input.email,
      input.passwordHash,
      input.age ?? null,
      input.role_user,
    ];

    const { rows } = await dbQuery(query, values);

    return new Account(rows[0]);
  }

  //
  static async findActiveByEmail(
    dbQuery: QueryDB,
    email: string,
  ): Promise<Account | null> {
    const query = `
      SELECT * FROM accounts 
      WHERE email = $1 AND is_active = true 
      LIMIT 1;
    `;
    const { rows } = await dbQuery(query, [email]);
    if (rows.length === 0) return null;
    return new Account(rows[0]);
  }
}
