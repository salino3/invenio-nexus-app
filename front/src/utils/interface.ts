import type { AccountProps, PropsCurrentAccount } from "@/store/interface";

export interface StateLoginDataAccount extends PropsCurrentAccount {
  token?: string;
}

export interface FormLoginProps extends Pick<
  AccountProps,
  "email" | "password"
> {}

export interface StateLoginAccount {
  success: boolean;
  error: string;
  data: StateLoginDataAccount | null;
  fieldErrors: FormLoginProps | null;
}
