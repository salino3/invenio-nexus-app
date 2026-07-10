export const Theme = {
  dark: "dark",
  light: "light",
} as const;

// Derive the type from the object for use those values as types
export type ThemeEnum = (typeof Theme)[keyof typeof Theme];

export type UserRole = "admin" | "user" | "manager";

export interface PropsCurrentAccount {
  id?: number;
  email: string;
  name?: string;
  role_user?: UserRole;
  hasAdFreeAccess: boolean;
  exp: number | null;
  iat: number | null;
}

export interface StateLoginDataAccount {
  user: PropsCurrentAccount;
  token?: string;
  success?: boolean;
  message?: string;
}

//
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

export interface PropsProvider {
  currentUser: PropsCurrentAccount | null;
  theme: ThemeEnum;
  setDataUser(data: PropsCurrentAccount | null): void;
  changeGlobalColors(): void;
}
