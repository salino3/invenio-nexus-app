import React, { useEffect, useState } from "react";
import { ServicesApp } from "@/store/services";
import type { ResponseSearchedCompanies } from "@/store/interface";
import { ListCompanies } from "./components";
import "./dashboard.styles.scss";

export interface SearchValuesCompaniesProps {
  search: string;
  offset: number;
}

export const Dashboard: React.FC = () => {
  const [companyResponse, setCompanyResponse] =
    useState<ResponseSearchedCompanies | null>(null);
  const [searchValuesCompanies, setSearchValuesCompanies] =
    useState<SearchValuesCompaniesProps>({
      search: "",
      offset: 0,
    });

  useEffect(() => {
    const controller = new AbortController();

    ServicesApp.getSearchingCompanies(
      searchValuesCompanies.search,
      searchValuesCompanies.offset,
      controller.signal,
    ).then((res) => setCompanyResponse(res ?? null));

    return () => {
      // If endpoint is done, automatically there is not execution for 'controller.abort'
      controller.abort();
    };
  }, [searchValuesCompanies]);

  // console.log("clog2", companyResponse);

  return (
    <div className="rootDashboard">
      <h1>DashboardLayout</h1>
      {/* // TODO: create form to searching list */}
      {companyResponse?.success ? (
        <ListCompanies companyResponse={companyResponse} />
      ) : null}
    </div>
  );
};
