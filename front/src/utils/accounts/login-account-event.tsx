import type { StateLoginAccount } from "../interface";

export async function loginAccountEvent(
  prevState: StateLoginAccount,
  formData: FormData,
): Promise<StateLoginAccount> {
  const email = formData.get("email") as string;

  try {
    return {
      success: true,
      data: { email },
      error: "",
      fieldErrors: null,
    };
  } catch (err) {
    return {
      ...prevState,
      success: false,
      error: "Qualcosa è andato storto con il login.",
    };
  }
}
