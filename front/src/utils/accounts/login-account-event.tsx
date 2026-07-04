import type { StateLoginAccount } from "../interface";
import { utilitiesApp } from "../utilities-app";

export async function loginAccountEvent(
  prevState: StateLoginAccount,
  formData: FormData,
): Promise<StateLoginAccount> {
  const { regexCorrectEmail } = utilitiesApp();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email.trim() || !password.trim()) {
    return {
      ...prevState,
      fieldErrors: {
        email: !email.trim() ? "" : "Email is required",
        password: !password.trim() ? "" : "Password is required",
      },
    };
  }

  if (!regexCorrectEmail.test(email)) {
    return {
      ...prevState,
      fieldErrors: {
        email: "Invalid Email address",
        password: "",
      },
    };
  }

  try {
    return {
      success: true,
      data: null,
      error: "",
      fieldErrors: null,
    };
  } catch (err) {
    return {
      ...prevState,
      error: "Error during login.",
    };
  }
}
