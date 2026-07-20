import { regexCorrectEmail } from "../utilities-app";
import type {
  FormRegisterErrorsProps,
  FormRegisterProps,
  StateRegisterAccount,
} from "./interface";

let accountErrorData: FormRegisterErrorsProps = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  age: "",
};

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

  (Object.entries(accountData) as [keyof FormRegisterProps, string][]).forEach(
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
        } else if (key === "age" && typeof value === "number") {
          if (value < 18) {
            accountErrorData = {
              ...accountErrorData,
              [key]: "Your age must be more than 17 years",
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
