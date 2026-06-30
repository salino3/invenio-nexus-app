export const Theme = {
  dark: "dark",
  light: "light",
} as const;

// Derive the type from the object for use those values as types
export type ThemeEnum = (typeof Theme)[keyof typeof Theme];

export interface PropsCurrentUser {
  id?: number;
  email: string;
  name?: string;
  role_user?: "user" | "admin";
  age?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropsProvider {
  currentUser: PropsCurrentUser | null;
  theme: ThemeEnum;
  changeGlobalColors(): void;
}
