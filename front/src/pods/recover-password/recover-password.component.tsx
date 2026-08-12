import React, { useActionState, useEffect, useState } from "react";
import {
  recoverPasswordAction,
  type StateRecoverPasswordAction,
} from "@/utils";
import { BasicInput } from "@/common";
import "./recover-password.styles.scss";

const initialState: StateRecoverPasswordAction = {
  status: "idle",
  message: "",
  formData: {
    email: "",
  },
};

export const RecoverPassword: React.FC = () => {
  const [state, formAction, isPending] = useActionState(
    recoverPasswordAction,
    initialState,
  );

  const [formEmail, setFormEmail] = useState<string>("");

  useEffect(() => {
    setFormEmail(state.formData.email);
  }, [state.formData]);

  return (
    <div className="rootRecoverPassword">
      <div className="recover-password-card">
        <h2>Recover Password</h2>
        <p>Enter your email address to receive a password reset link.</p>

        <form action={formAction} noValidate>
          <fieldset disabled={isPending}>
            <BasicInput
              name="email"
              type="email"
              lbl="Email"
              change={(
                e: React.ChangeEvent<HTMLInputElement, Element> | undefined,
              ) => setFormEmail(e?.target.value ?? "")}
              stateValue={formEmail ?? state?.formData?.email}
              value={formEmail ?? state?.formData?.email}
              errorMsg={""}
            />

            {state.status !== "idle" && (
              <div className={`status-message ${state.status}`}>
                {state.message}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};
