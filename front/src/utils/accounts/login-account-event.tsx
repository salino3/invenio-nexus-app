import { ServicesApp } from "@/store/services";
import { utilitiesApp } from "../utilities-app";
import type { FormLoginProps, StateLoginAccount } from "../interface";

export async function loginAccountEvent(
  prevState: StateLoginAccount,
  formData: FormData,
): Promise<StateLoginAccount> {
  const { regexCorrectEmail } = utilitiesApp();

  let accountData: FormLoginProps = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  let accountErrorData: FormLoginProps = {
    email: "",
    password: "",
  };

  (Object.entries(accountData) as [keyof FormLoginProps, string][]).forEach(
    ([key, value]) => {
      if (!value || !value.trim()) {
        accountErrorData = {
          ...accountErrorData,
          [key]: `The ${key} is required`,
        };
      } else {
        if (key === "email") {
          if (!regexCorrectEmail.test(value)) {
            accountErrorData = {
              ...accountErrorData,
              [key]: "Invalid Email address",
            };
          }
        } else if (key === "password") {
          if (value.length < 6 || value.length > 20) {
            accountErrorData = {
              ...accountErrorData,
              [key]: "Password must be between 6 and 20 characters",
            };
          }
        }
      }
    },
  );

  const hasErrors: boolean = Object.values(accountErrorData).some(
    (msg) => msg !== "",
  );

  if (hasErrors) {
    return {
      ...prevState,
      fieldErrors: accountErrorData,
      formData: accountData,
    };
  }

  try {
    const result = await ServicesApp.serviceLoginAccount(accountData);
    console.log("clog1", result);
    if (result && result.token) {
      return {
        ...prevState,
        success: true,
        data: result,
        error: "",
        fieldErrors: null,
      };
    }

    return {
      ...prevState,
      success: false,
      error: "Authentication token was not received from the server.",
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
