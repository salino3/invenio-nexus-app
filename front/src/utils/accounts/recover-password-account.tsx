import { ServicesApp } from "@/store/services";
import { regexCorrectEmail } from "../utilities-app";
import type { StateRecoverPasswordAction } from "./interface";

export async function recoverPasswordAction(
  _prevState: StateRecoverPasswordAction,
  formData: FormData,
): Promise<StateRecoverPasswordAction> {
  const email = formData.get("email")?.toString().trim() ?? "";

  if (!email) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
      formData: { email: email },
    };
  }

  if (!regexCorrectEmail.test(email)) {
    return {
      status: "error",
      message: "Invalid format email .",
      formData: { email: email },
    };
  }

  try {
    const success = await ServicesApp.recoverPassword(email);

    if (success) {
      return {
        status: "success",
        message: `If an account exists with email '${email}', we have sent a password reset link.`,
        formData: { email: "" },
      };
    }

    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
      formData: { email: email },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: "error",
      message: "An unexpected error occurred. Please try again.",
      formData: { email: email },
    };
  }
}
