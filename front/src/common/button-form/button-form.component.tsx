import React, { type JSX } from "react";
import { useFormStatus } from "react-dom";
import "./button-form.styles.scss";

interface Props {
  text: string;
  customStyles?: string;
  type: "submit" | "reset" | "button" | undefined;
  icon?: JSX.Element;
}

export const ButtonForm: React.FC<Props> = (props) => {
  const { text, customStyles, type, icon } = props;

  const { pending } = useFormStatus();

  return (
    <div className={`rootButtonForm ${customStyles}`}>
      <button type={type} disabled={pending} className="btnSubmitButton">
        {pending ? "Loading..." : text}
        {icon}
      </button>
    </div>
  );
};
