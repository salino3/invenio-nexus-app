import type React from "react";
import { useActionState, useState } from "react";
import type { FormRegisterErrorsProps, FormRegisterProps } from "@/utils";
import { registerAccountEvent } from "@/utils/accounts/register-account.event";
import { ButtonForm } from "@/common";
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

  const isButtonDisabled: boolean = Object.values(formData).some(
    (value: string) =>
      typeof value === "string" ? value.trim().length > 0 : !!value,
  );

  return (
    <form className="rootRegisterForm" action={formAction}>
      <fieldset disabled={isPending}>
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
