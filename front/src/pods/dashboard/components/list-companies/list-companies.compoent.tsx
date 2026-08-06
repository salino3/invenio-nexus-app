import type React from "react";
import { CardCompanyList } from "../card-company-list";
import type {
  DataSearchedCompanies,
  ResponseSearchedCompanies,
} from "@/store/interface";
import "./list-companies.styles.scss";

interface Props {
  companyResponse: ResponseSearchedCompanies;
}

export const ListCompanies: React.FC<Props> = (props) => {
  const { companyResponse } = props;
  return (
    <div className="rootListComponent">
      <h3>Companies found ~ {companyResponse.total ?? 0}</h3>
      <hr />
      <ol>
        {companyResponse.data.length > 0 ? (
          companyResponse.data.map((company: DataSearchedCompanies) => (
            <CardCompanyList key={company.uuid} company={company} />
          ))
        ) : (
          <li>No companies found</li>
        )}
      </ol>
    </div>
  );
};
