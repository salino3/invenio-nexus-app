import React from "react";
import { Link } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import { Aside } from "../../common-app";
import { routePaths } from "../../router/routes.interface";
import "../../App.scss";
import "./error-page.styles.scss";

const ErrorPageLayout: React.FC = () => {
  const { currentUser } = useProviderSelector("currentUser");

  return (
    <div className="rootRouter">
      {!currentUser?.hasAdFreeAccess && <Aside />}
      <div className="errorPageLayout">
        <div className="errorCard">
          <h1 className="errorCode">404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for does not exist or has been moved.</p>
          <Link to={routePaths.public_dashboard} className="back-home-btn">
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPageLayout;
