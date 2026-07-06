import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import { utilitiesApp } from "@/utils";
import { routePaths } from "../routes.interface";

export const PrivateRoutes: React.FC = () => {
  const { setDataUser } = useProviderSelector("setDataUser");

  const { getAuthToken } = utilitiesApp();

  const token = getAuthToken();
  React.useEffect(() => {
    if (token) {
      setDataUser && setDataUser(token);
    }
  }, []);

  if (!token) {
    return <Navigate to={routePaths.public_dashboard} replace />;
  }

  return <Outlet />;
};
