export type UserRole = "admin" | "user" | "manager";

export interface AccountProps {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role_user: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

// Interface for input data during registration
export interface RegistretionAccountDB extends Pick<
  AccountProps,
  "name" | "email" | "age" | "password"
> {}

export interface RegistretionAccountInput extends Pick<
  AccountProps,
  keyof RegistretionAccountDB
> {
  confirmPassword: string;
}
