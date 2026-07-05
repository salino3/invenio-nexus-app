import type React from "react";
import { useActionState, useEffect, useState } from "react";
import { useProviderSelector } from "@/store/provider";
import { loginAccountEvent, type FormLoginProps } from "@/utils";
import "./login-form.styles.scss";

export const initialDataState: FormLoginProps = {
  email: "",
  password: "",
};

export const LoginForm: React.FC = () => {
  const { getDataUser } = useProviderSelector("getDataUser");

  const [formData, setFormData] = useState<FormLoginProps>(initialDataState);
  const [formErrorData, setFormErrorData] =
    useState<FormLoginProps>(initialDataState);

  // 'useActionState' for loginAccountEvent is automatically asyncronous
  const [state, formAction, isPending] = useActionState(loginAccountEvent, {
    success: false,
    data: null,
    error: "",
    fieldErrors: null,
    formData: null,
  });

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
      getDataUser && getDataUser(state.data.user);
    } else if (!state?.success && !state?.data) {
      setFormErrorData(state?.fieldErrors as FormLoginProps);
    }
  }, [state]);

  const isButtonDisabled: boolean =
    isPending || !formData.email.trim() || !formData.password.trim();

  return (
    <form action={formAction} id="rootLoginForm">
      <fieldset disabled={isPending}>
        <div className="boxInput">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            defaultValue={state?.formData?.email}
            value={formData.email}
            onChange={hanldeChangeFrom("email")}
          />
          <div className="errorBox">
            {formErrorData && formErrorData?.email && (
              <span className="errorMsg">{formErrorData.email}</span>
            )}
          </div>
        </div>

        <div className="boxInput">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            defaultValue={state?.formData?.password}
            value={formData.password}
            onChange={hanldeChangeFrom("password")}
          />
          <div className="errorBox">
            {formErrorData && formErrorData?.password && (
              <span className="errorMsg">{formErrorData.password}</span>
            )}
          </div>
        </div>

        <button disabled={isButtonDisabled}>Submit</button>
      </fieldset>
    </form>
  );
};
