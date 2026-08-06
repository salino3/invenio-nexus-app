import React, { useEffect, useState } from "react";
import { ServicesApp } from "@/store/services";
import "./dashboard.styles.scss";

export interface SearchValuesCompaniesProps {
  search: string;
  offset: number;
}

export const Dashboard: React.FC = () => {
  const [searchValuesCompanies, setSearchValuesCompanies] =
    useState<SearchValuesCompaniesProps>({
      search: "",
      offset: 0,
    });

  useEffect(() => {
    ServicesApp.getSearchingCompanies(
      searchValuesCompanies.search,
      searchValuesCompanies.offset,
    ).then((res) => console.log("clog1", res));
  }, []);

  return <div className="rootDashboard">DashboardLayout</div>;
};
