import React, { useActionState } from "react";
import { useParams } from "react-router-dom";
import type { StateResetPasswordAction } from "@/utils";
import "./reset-password.styles.scss";

const initialState: StateResetPasswordAction = {
  status: false,
  message: "",
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

  return (
    <div className="rootResetPassword">
      <form action="">
        <fieldset disabled={false}>
          rootResetPassword
          <h2>{token}</h2>
        </fieldset>
      </form>
    </div>
  );
};
