import type { PropsCurrentAccount } from "@/store/interface";

export interface StateLoginDataAccount extends PropsCurrentAccount {
  token?: string;
}

export interface FormErrorLoginProps {
  email: string;
  password: string;
}

export interface StateLoginAccount {
  success: boolean;
  error: string;
  data: StateLoginDataAccount | null;
  fieldErrors: FormErrorLoginProps | null;
}
