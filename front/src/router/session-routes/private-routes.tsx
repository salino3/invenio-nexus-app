import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import { utilitiesApp } from "@/utils/utilities-app";
import { routePaths } from "../routes.interface";

export const PrivateRoutes: React.FC = () => {
  const navigate = useNavigate();
  const { setDataUser } = useProviderSelector("setDataUser");

  const { getAuthToken } = utilitiesApp();

  React.useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate(routePaths.public_dashboard);
    } else {
      setDataUser && setDataUser(token);
    }
  }, []);

  return <Outlet />;
};
