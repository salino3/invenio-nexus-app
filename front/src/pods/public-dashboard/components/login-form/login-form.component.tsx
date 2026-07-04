import { useActionState } from "react";
import type React from "react";
import { loginAccountEvent, type StateLoginAccount } from "@/utils";
import "./login-form.styles.scss";

export const LoginForm: React.FC = () => {
  const [state, formAction, isPending] = useActionState(
    async (prevState: StateLoginAccount, formData: FormData) =>
      await loginAccountEvent(prevState, formData),
    {
      success: false,
      data: null,
      error: "",
      fieldErrors: null,
    },
  );

  return (
    <form action={formAction} className="rootLoginForm">
      <fieldset disabled={isPending}>
        <div className="boxInput">
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" />
        </div>

        <div className="boxInput">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
        </div>

        <button disabled={isPending}>Submit</button>
      </fieldset>
    </form>
  );
};
