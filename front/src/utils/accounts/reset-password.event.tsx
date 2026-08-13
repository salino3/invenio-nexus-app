import { ServicesApp } from "@/store/services";
import type { FormResetProps, StateResetPasswordAction } from "./interface";

const createInitialErrorState = (): FormResetProps => ({
  token: "",
  newPassword: "",
  confirmNewPassword: "",
});

export async function resetPasswordAction(
  prevState: StateResetPasswordAction,
  formData: FormData,
): Promise<StateResetPasswordAction> {
  let formResetData: FormResetProps = {
    token: formData.get("token") as string,
    newPassword: formData.get("newPassword") as string,
    confirmNewPassword: formData.get("confirmNewPassword") as string,
  };

  let formRestErrorData: FormResetProps = createInitialErrorState();

  (Object.entries(formResetData) as [keyof FormResetProps, string][]).forEach(
    ([key, value]) => {
      if (!value || !value.trim()) {
        formRestErrorData = {
          ...formRestErrorData,
          [key]: `The ${key} is required`,
        };
      } else if (key === "newPassword") {
        if (value.length < 6 || value.length > 20) {
          formRestErrorData = {
            ...formRestErrorData,
            [key]: "Password must be between 6 and 20 characters",
          };
        }
      } else if (key === "confirmNewPassword") {
        if (value === formResetData.newPassword) {
          formRestErrorData = {
            ...formRestErrorData,
            [key]: "Confirm password must match with password",
          };
        }
      }
    },
  );

  const haserrors: boolean = Object.values(formRestErrorData).some(
    (msg: string) => msg !== "",
  );

  if (haserrors) {
    return {
      ...prevState,
      fieldErrors: formRestErrorData,
      formData: formResetData,
    };
  }

  try {
    const result: boolean = await ServicesApp.resetPassword(
      formResetData.token,
      formResetData.newPassword,
    );

    if (result) {
      return {
        formData: null,
        fieldErrors: null,
        error: "",
        status: true,
      };
    } else {
      return {
        formData: formResetData,
        fieldErrors: formRestErrorData,
        error: "Server error, try again later",
        status: false,
      };
    }
  } catch (err) {
    return {
      formData: formResetData,
      fieldErrors: formRestErrorData,
      error: err as string,
      status: false,
    };
  }
}
