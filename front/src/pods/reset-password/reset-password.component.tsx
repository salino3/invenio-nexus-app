import React, { useActionState, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  resetPasswordAction,
  type FormResetProps,
  type StateResetPasswordAction,
} from "@/utils";
import { BasicInput, ButtonForm } from "@/common";
import { routePaths } from "@/router/routes.interface";
import "./reset-password.styles.scss";

type FromRestOmitedToken = Omit<FormResetProps, "token">;

const initialState: StateResetPasswordAction = {
  success: false,
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
  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  const [formData, setFormData] = useState<FromRestOmitedToken>({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [formErrorData, setFormErrorData] = useState<FromRestOmitedToken>({
    newPassword: "",
    confirmNewPassword: "",
  });

  //
  const hanldeChangeFrom =
    (key: keyof FromRestOmitedToken) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setFormData((prev: FromRestOmitedToken) => ({
        ...prev,
        [key]: value,
      }));

      setFormErrorData((prev: FromRestOmitedToken) => ({
        ...prev,
        [key]: "",
      }));
    };

  const isButtonDisabled: boolean = Object.values(formData).some(
    (value: string) =>
      typeof value === "string" ? value.trim().length === 0 : !!value,
  );

  //
  useEffect(() => {
    if (state?.success) {
      navigate(routePaths.public_dashboard);
      //   const { token, ...resetFields } = initialState.formData as FormResetProps;
      //   setFormData(resetFields);
      //   setFormErrorData(resetFields);
    } else if (!state?.success && state?.error) {
      setFormErrorData(state?.fieldErrors as FormResetProps);
    }
  }, [state]);

  return (
    <div className="rootResetPassword">
      <form action={formAction} noValidate>
        <fieldset disabled={false}>
          <legend>Reset Password Form</legend>
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
          {state.error && state.error !== "error" && (
            <span className="errMsg">{state.error}</span>
          )}
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
