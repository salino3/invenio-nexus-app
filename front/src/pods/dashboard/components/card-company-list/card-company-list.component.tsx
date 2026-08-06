import type React from "react";
import type { DataSearchedCompanies } from "@/store/interface";
import "./card-company-list.styles.scss";

interface Props {
  company: DataSearchedCompanies;
}

export const CardCompanyList: React.FC<Props> = ({ company }) => {
  return (
    <li className="rootCardCompanyList">
      <h4>{company.name}</h4>
    </li>
  );
};
