import React, { type JSX } from "react";
import "./button-form.styles.scss";

interface Props {
  text: string;
  customStyles?: string;
  type: "submit" | "reset" | "button" | undefined;
  disabled?: boolean | undefined;
  pendingForm?: boolean;
  textLoading?: string | JSX.Element | undefined;
  click?: React.MouseEventHandler<HTMLButtonElement> | undefined;

  icon?: JSX.Element;
  al?: string | undefined;
  tabIndex?: number | undefined;
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
    click,
    al,
    tabIndex = 0,
  } = props;

  //   const { pending } = useFormStatus();

  return (
    <div className={`rootButtonForm ${customStyles}`}>
      <button
        aria-label={al}
        tabIndex={tabIndex}
        onClick={click}
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
