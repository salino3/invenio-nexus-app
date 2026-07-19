import type { FormRegisterErrorsProps, FormRegisterProps } from "@/utils";
import type React from "react";
import { useState } from "react";

export const initialDataState: FormRegisterProps = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  age: null,
};

export const initialErrorDataState: FormRegisterErrorsProps = {
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

  return <form className="rootRegisterForm"></form>;
};
