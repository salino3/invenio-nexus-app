import React, { useActionState } from "react";
import { ServicesApp } from "@/store/services";
import {
  recoverPasswordAction,
  type StateRecoverPasswordAction,
} from "@/utils";
import "./recover-password.styles.scss";

const initialState: StateRecoverPasswordAction = {
  status: "idle",
  message: "",
};

export const RecoverPassword: React.FC = () => {
  const [state, formAction, isPending] = useActionState(
    recoverPasswordAction,
    initialState,
  );

  return (
    <div className="rootRecoverPassword">
      <div className="recover-password-card">
        <h2>Recover Password</h2>
        <p>Enter your email address to receive a password reset link.</p>

        <form action={formAction} noValidate>
          <fieldset disabled={isPending}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                disabled={isPending}
                required
              />
            </div>

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
