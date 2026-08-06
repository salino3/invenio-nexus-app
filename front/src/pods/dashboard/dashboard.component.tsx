import React, { useEffect, useState } from "react";
import { ServicesApp } from "@/store/services";
import type { SearchedCompanies } from "@/store/interface";
import { ListComponent } from "./components";
import "./dashboard.styles.scss";

export interface SearchValuesCompaniesProps {
  search: string;
  offset: number;
}

export const Dashboard: React.FC = () => {
  const [companyList, setCompanyList] = useState<SearchedCompanies[]>([]);
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
    ).then((res) => setCompanyList(res ?? []));

    return () => {
      // If endpoint is done there is not execution for 'controller.abort'
      controller.abort();
    };
  }, [searchValuesCompanies]);

  console.log("clog2", companyList);

  return (
    <div className="rootDashboard">
      <h1>DashboardLayout</h1>
      <ListComponent />
    </div>
  );
};
