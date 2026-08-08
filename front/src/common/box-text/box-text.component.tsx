import type React from "react";
import "./box-text.styles.scss";

interface BoxTextProps {
  title: string;
  tag: React.ElementType;
  value: string;
  customStyles?: string | undefined;
}

export const BoxText: React.FC<BoxTextProps> = ({
  title,
  tag: Tag = "span",
  value,
  customStyles,
}) => (
  <div className={`boxText ${customStyles}`}>
    <strong>{title}</strong>
    <Tag className="tagValue">{value}</Tag>
  </div>
);
