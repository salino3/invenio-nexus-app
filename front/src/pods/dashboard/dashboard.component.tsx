import React, { useEffect } from "react";
import { ServicesApp } from "@/store/services";
import "./dashboard.styles.scss";

export const Dashboard: React.FC = () => {
  useEffect(() => {
    ServicesApp.getSearchingCompanies("").then((res) =>
      console.log("clog1", res),
    );
  }, []);

  return <div className="rootDashboard">DashboardLayout</div>;
};
