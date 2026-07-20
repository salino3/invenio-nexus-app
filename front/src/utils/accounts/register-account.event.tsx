import { ServicesApp } from "@/store/services";
import { regexCorrectEmail } from "../utilities-app";
import type {
  FormRegisterErrorsProps,
  FormRegisterProps,
  StateRegisterAccount,
} from "./interface";

const createInitialErrorState = (): FormRegisterErrorsProps => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  age: "",
});

export async function registerAccountEvent(
  prevState: StateRegisterAccount,
  formData: FormData,
): Promise<StateRegisterAccount> {
  let accountData: FormRegisterProps = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    age: formData.get("age") as number | null,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  let accountErrorData: FormRegisterErrorsProps = createInitialErrorState();

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
        } else if (
          key === "confirmPassword" &&
          value !== accountData.password
        ) {
          accountErrorData = {
            ...accountErrorData,
            [key]: "Password mismatch with confirm password",
          };
        } else if (key === "password") {
          if (value.length < 6 || value.length > 20) {
            accountErrorData = {
              ...accountErrorData,
              [key]: "Password must be between 6 and 20 characters",
            };
          }
        } else if (key === "age") {
          if (Number(value) < 18) {
            accountErrorData = {
              ...accountErrorData,
              [key]: "Your age must be minimum 18 years old",
            };
          }
        }
      }
    },
  );
  console.log("acc", accountData);
  const hasErrors: boolean = Object.values(accountErrorData).some(
    (msg) => msg !== "",
  );

  if (hasErrors) {
    return {
      fieldErrors: accountErrorData,
      formData: accountData,
      error: "Error",
      success: false,
    };
  }

  try {
    const result = await ServicesApp.registerAccount(accountData);

    if (result.user) {
      return {
        ...prevState,
        success: true,
        error: "",
        fieldErrors: null,
      };
    }

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
