import type { FormLoginProps, StateLoginAccount } from "../interface";
import { utilitiesApp } from "../utilities-app";

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
      }

      if (key === "email") {
        if (!regexCorrectEmail.test(value)) {
          accountErrorData = {
            ...accountErrorData,
            [key]: "Invalid Email address",
          };
        }
      } else {
        if (value.length < 6 || value.length > 20) {
          accountErrorData = {
            ...accountErrorData,
            [key]:
              "Length Password is not correct, Password must be between 6 and 20 characters",
          };
        }
      }
    },
  );

  if (Object.values(accountErrorData).length > 0) {
    return {
      ...prevState,
      fieldErrors: accountErrorData,
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
