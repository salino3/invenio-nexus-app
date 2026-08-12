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

//
export interface KeepToInterfaceFormRegister {
  name: string;
  email: string;
  password: string;
}

export interface FormRegisterProps extends Pick<
  AccountProps,
  keyof KeepToInterfaceFormRegister
> {
  confirmPassword: string;
  age: number | null;
}

export interface FormRegisterErrorsProps extends Pick<
  AccountProps,
  keyof KeepToInterfaceFormRegister
> {
  confirmPassword: string;
  age: string;
}

export interface StateRegisterAccount {
  success: boolean;
  error: string;
  fieldErrors: FormRegisterErrorsProps | null;
  formData: FormRegisterProps | null;
}

//
export type StatusRecoverPassword = "idle" | "success" | "error";

export interface StateRecoverPasswordAction {
  status: StatusRecoverPassword;
  message: string;
  formData: {
    email: string;
  };
}
