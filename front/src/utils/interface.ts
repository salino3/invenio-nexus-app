import type { AccountProps, StateLoginDataAccount } from "@/store/interface";

export interface FormLoginProps extends Pick<
  AccountProps,
  "email" | "password"
> {}

export interface StateLoginAccount {
  success: boolean;
  error: string;
  data: StateLoginDataAccount | null;
  fieldErrors: FormLoginProps | null;
  formData: FormLoginProps | null;
}
