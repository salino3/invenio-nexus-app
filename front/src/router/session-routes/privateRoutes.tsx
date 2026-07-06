import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import { useProviderSelector } from "../../store";
import { utilitiesApp } from "@/utils/utilities-app";
import { routePaths } from "../routes.interface";

export const PrivateRoutes: React.FC = () => {
  const navigate = useNavigate();
  //   const { loginAccount } = useProviderSelector("loginAccount");
  const { getAuthToken } = utilitiesApp();

  React.useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate(routePaths.public_dashboard);
    } else {
      //   loginAccount && loginAccount(token);
    }
  }, []);

  return <Outlet />;
};
