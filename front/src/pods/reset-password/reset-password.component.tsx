import React, { useActionState, useState } from "react";
import { useParams } from "react-router-dom";
import {
  resetPasswordAction,
  type FormResetProps,
  type StateResetPasswordAction,
} from "@/utils";
import { BasicInput, ButtonForm } from "@/common";
import "./reset-password.styles.scss";

const initialState: StateResetPasswordAction = {
  status: false,
  error: "",
  fieldErrors: null,
  formData: {
    token: "",
    newPassword: "",
    confirmNewPassword: "",
  },
};

export const ResetPassword: React.FC = () => {
  const { token } = useParams();

  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  const [formData, setFormData] = useState<Omit<FormResetProps, "token">>({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [formErrorData, setFormErrorData] = useState<FormResetProps>({
    newPassword: "",
    confirmNewPassword: "",
    token: "",
  });

  //
  const hanldeChangeFrom =
    (key: keyof Omit<FormResetProps, "token">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setFormData((prev: Omit<FormResetProps, "token">) => ({
        ...prev,
        [key]: value,
      }));

      setFormErrorData((prev: FormResetProps) => ({
        ...prev,
        [key]: "",
      }));
    };

  const isButtonDisabled: boolean = Object.values(formData).some(
    (value: string) =>
      typeof value === "string" ? value.trim().length === 0 : !!value,
  );

  return (
    <div className="rootResetPassword">
      <form action={formAction} noValidate>
        <fieldset disabled={false}>
          <h2>Reset Password Form</h2>
          <input type="hidden" name="token" value={token ?? ""} />
          <BasicInput
            name="newPassword"
            type="password"
            lbl="New Password"
            change={hanldeChangeFrom("newPassword")}
            stateValue={state?.formData?.newPassword}
            value={formData.newPassword}
            errorMsg={formErrorData?.newPassword}
          />
          <BasicInput
            name="confirmNewPassword"
            type="password"
            lbl="Confirm New Password"
            change={hanldeChangeFrom("confirmNewPassword")}
            stateValue={state?.formData?.confirmNewPassword}
            value={formData.confirmNewPassword}
            errorMsg={formErrorData?.confirmNewPassword}
          />
          <ButtonForm
            text="Submit"
            type="submit"
            disabled={isButtonDisabled}
            pendingForm={isPending}
          />
        </fieldset>
      </form>
    </div>
  );
};
