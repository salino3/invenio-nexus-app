import React, { type JSX } from "react";
import "./button-form.styles.scss";

interface Props {
  text: string;
  customStyles?: string;
  type: "submit" | "reset" | "button" | undefined;
  disabled?: boolean | undefined;
  pendingForm?: boolean;
  textLoading?: string | JSX.Element | undefined;
  icon?: JSX.Element;
}

export const ButtonForm: React.FC<Props> = (props) => {
  const {
    text,
    customStyles,
    type,
    disabled,
    pendingForm,
    textLoading = "Loading...",
    icon,
  } = props;

  //   const { pending } = useFormStatus();

  return (
    <div className={`rootButtonForm ${customStyles}`}>
      <button
        type={type}
        disabled={pendingForm || disabled}
        className="btnSubmitButton"
      >
        {pendingForm ? textLoading : text}
        {icon}
      </button>
    </div>
  );
};
