import type { FormRegisterProps, StateRegisterAccount } from "./interface";

export async function registerAccountEvent(
  prevState: StateRegisterAccount,
  formData: FormData,
): Promise<StateRegisterAccount> {
  let accountData: FormRegisterProps = {
    name: formData.get("email") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    age: formData.get("age") as number | null,
    confirmPassword: formData.get("email") as string,
  };
  try {
    return {
      success: true,
      error: "",
      fieldErrors: null,
      formData: accountData,
    };
  } catch (err) {
    return {
      ...prevState,
      error: err as string,
      formData: accountData,
    };
  }
}
