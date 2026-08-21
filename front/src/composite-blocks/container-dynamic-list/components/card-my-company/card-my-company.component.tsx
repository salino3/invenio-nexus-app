import type React from "react";
import { MoreIcon } from "@/components";
import type { MyCompaniesProps } from "@/store/interface";
import "./card-my-company.styles.scss";

export const CardMyCompany: React.FC<{ item: MyCompaniesProps }> = ({
  item,
}) => {
  const { uuid, name, logo } = item;
  return (
    <div className="rootCardMyCompany">
      <strong> {name}</strong>
      {logo === "more-icon" ? <MoreIcon /> : <img src={logo} alt="" />}
    </div>
  );
};
