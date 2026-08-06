import type React from "react";
import type { ResponseSearchedCompanies } from "@/store/interface";
import "./list-companies.styles.scss";

interface Props {
  companyResponse: ResponseSearchedCompanies;
}

export const ListCompanies: React.FC<Props> = (props) => {
  const { companyResponse } = props;
  return (
    <div className="rootListComponent">
      <h3>Companies found ~ {companyResponse.total ?? 0}</h3>
    </div>
  );
};
