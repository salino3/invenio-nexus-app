import type React from "react";
import { CompanyPage } from "@/pods";
import "./company-page.styles.scss";

const CompanyPageLayout: React.FC = () => {
  return (
    <div className="rootCompanyPageLayout">
      <CompanyPage />
    </div>
  );
};

export default CompanyPageLayout;
