import type React from "react";
import "./basic-input.styles.scss";

interface Props {
  value?: string | number | readonly string[] | undefined;
  stateValue?: string | number | readonly string[] | undefined;
  change?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  name: string | undefined;
  type: React.HTMLInputTypeAttribute | undefined;
  lbl?: string;
  customStyles?: string;
  errorMsg: string;
  pl?: string | undefined;
}

export const BasicInput: React.FC<Props> = (props) => {
  const {
    value,
    stateValue,
    change,
    name,
    type,
    lbl,
    customStyles,
    errorMsg,
    pl,
  } = props;

  return (
    <div className={`rootBasicInput ${customStyles ?? ""}`}>
      <label htmlFor={name + "ID"}>{lbl ?? name}</label>
      <input
        type={type}
        id={name + "ID"}
        name={name}
        defaultValue={stateValue}
        placeholder={pl}
        value={value}
        onChange={change}
      />
      <div className="errorBox">
        {errorMsg && <span className="errorMsg">{errorMsg}</span>}
      </div>
    </div>
  );
};
