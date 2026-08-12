import { ServicesApp } from "@/store/services";
import type { StateRecoverPasswordAction } from "./interface";

export async function recoverPasswordAction(
  _prevState: StateRecoverPasswordAction,
  formData: FormData,
): Promise<StateRecoverPasswordAction> {
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  try {
    const success = await ServicesApp.recoverPassword(email);

    if (success) {
      return {
        status: "success",
        message:
          "If an account exists with that email, we have sent a password reset link.",
      };
    }

    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: "error",
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
