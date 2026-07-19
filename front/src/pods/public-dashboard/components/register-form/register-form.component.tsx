import type React from "react";
import { useActionState, useState } from "react";
import type { FormRegisterErrorsProps, FormRegisterProps } from "@/utils";
import { registerAccountEvent } from "@/utils/accounts/register-account.event";
import { BasicInput, ButtonForm } from "@/common";
import "./register-form.styles.scss";

const initialDataState: FormRegisterProps = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  age: null,
};

const initialErrorDataState: FormRegisterErrorsProps = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  age: "",
};

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormRegisterProps>(initialDataState);
  const [formErrorData, setFormErrorData] = useState<FormRegisterErrorsProps>(
    initialErrorDataState,
  );

  const [state, formAction, isPending] = useActionState(registerAccountEvent, {
    success: false,
    error: "",
    fieldErrors: null,
    formData: null,
  });

  const hanldeChangeFrom =
    (key: keyof FormRegisterProps) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setFormData((prev: FormRegisterProps) => ({
        ...prev,
        [key]: value,
      }));

      setFormErrorData((prev: FormRegisterErrorsProps) => ({
        ...prev,
        [key]: "",
      }));
    };

  const isButtonDisabled: boolean = Object.values(formData).some(
    (value: string) =>
      typeof value === "string" ? value.trim().length > 0 : !!value,
  );

  return (
    <form className="rootRegisterForm" action={formAction}>
      <fieldset disabled={isPending}>
        <BasicInput
          name="name"
          type=" text"
          change={hanldeChangeFrom("name")}
          lbl="Name"
          stateValue={state?.formData?.name}
          value={formData.name}
          errorMsg={formErrorData?.name}
        />
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
        <BasicInput
          name="confirmPassword"
          type="password"
          change={hanldeChangeFrom("confirmPassword")}
          lbl="Confirm Password"
          stateValue={state?.formData?.confirmPassword}
          value={formData.confirmPassword}
          errorMsg={formErrorData?.confirmPassword}
        />

        <BasicInput
          name="age"
          type="number"
          change={hanldeChangeFrom("age")}
          lbl="Age"
          stateValue={state?.formData?.age ?? ""}
          value={formData.age ?? ""}
          errorMsg={formErrorData?.age}
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
