import type React from "react";
import type { ResponseSearchedCompanies } from "@/store/interface";
import "./list-component.styles.scss";

interface Props {
  companyResponse: ResponseSearchedCompanies;
}

export const ListComponent: React.FC<Props> = (props) => {
  const { companyResponse } = props;
  return <div className="rootListComponent">ListComponent</div>;
};
