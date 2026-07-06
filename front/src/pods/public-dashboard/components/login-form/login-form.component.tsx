import type React from "react";
import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import { BasicInput, ButtonForm } from "@/common";
import { loginAccountEvent, type FormLoginProps } from "@/utils";
import { routePaths } from "@/router/routes.interface";
import "./login-form.styles.scss";

export const initialDataState: FormLoginProps = {
  email: "",
  password: "",
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const { setDataUser } = useProviderSelector("setDataUser");

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
      setDataUser && setDataUser(state.data.user);
    } else if (!state?.success && !state?.data) {
      setFormErrorData(state?.fieldErrors as FormLoginProps);
    }
  }, [state]);

  useEffect(() => {
    if (state?.success && state?.data?.token) {
      navigate(routePaths.dashboard);
    }
  }, [isPending]);

  const isButtonDisabled: boolean =
    !formData.email.trim() || !formData.password.trim();

  return (
    <form action={formAction} id="rootLoginForm">
      <fieldset disabled={isPending}>
        <BasicInput
          name="email"
          type="email"
          change={hanldeChangeFrom("email")}
          lbl="Email"
          stateValue={state?.formData?.email}
          value={formData.email}
          errorMsg={formErrorData?.email}
        />

        <BasicInput
          name="password"
          type="password"
          change={hanldeChangeFrom("password")}
          lbl="Password"
          stateValue={state?.formData?.password}
          value={formData.password}
          errorMsg={formErrorData?.password}
        />

        <ButtonForm
          text="Submit"
          type="submit"
          disabled={isButtonDisabled}
          pendingForm={isPending}
        />
      </fieldset>
    </form>
  );
};
