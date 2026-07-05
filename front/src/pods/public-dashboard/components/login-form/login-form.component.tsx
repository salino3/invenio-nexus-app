import type React from "react";
import { useActionState, useEffect, useState } from "react";
import {
  loginAccountEvent,
  type FormLoginProps,
  type StateLoginAccount,
} from "@/utils";
import "./login-form.styles.scss";

export const initialDataState: FormLoginProps = {
  email: "",
  password: "",
};

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormLoginProps>(initialDataState);
  const [formErrorData, setFormErrorData] =
    useState<FormLoginProps>(initialDataState);

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

  const hanldeChangeFrom =
    (key: keyof FormLoginProps) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setFormData((prev: FormLoginProps) => ({
        ...prev,
        [key]: value,
      }));

      setFormErrorData((prev: FormLoginProps) => ({
        ...prev,
        [key]: "",
      }));
    };

  useEffect(() => {
    if (state?.success && state?.data) {
      setFormData(initialDataState);
      setFormErrorData(initialDataState);
    } else if (!state?.success && !state?.data) {
      setFormErrorData(state.fieldErrors as FormLoginProps);
    }
  }, [state]);

  const isButtonDisabled: boolean =
    isPending || !formData.email.trim() || !formData.password.trim();

  return (
    <form action={formAction} className="rootLoginForm">
      <fieldset disabled={isPending}>
        <div className="boxInput">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={hanldeChangeFrom("email")}
          />
          {/* TODO: show off error mesasage */}
        </div>

        <div className="boxInput">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={hanldeChangeFrom("password")}
          />
        </div>

        <button disabled={isButtonDisabled}>Submit</button>
      </fieldset>
    </form>
  );
};
