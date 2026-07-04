import type { StateLoginAccount } from "../interface";

export async function loginAccountEvent(
  prevState: StateLoginAccount,
  formData: FormData,
): Promise<StateLoginAccount> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email.trim() || !password.trim()) {
    return {
      ...prevState,
      error: "Email and Password are required",
      fieldErrors: {
        email: !email.trim() ? "" : "Email is required",
        password: !password.trim() ? "" : "Password is required",
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
