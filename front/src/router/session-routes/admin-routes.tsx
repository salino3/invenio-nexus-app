import React from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import { utilitiesApp } from "@/utils";
import { routePaths } from "../routes.interface";

export const AdminRoutes: React.FC = () => {
  const navigate = useNavigate();

  const { setDataUser } = useProviderSelector("setDataUser");

  const { getAuthToken } = utilitiesApp();

  const token = getAuthToken();
  React.useEffect(() => {
    if (!token || token?.role_user !== "admin") {
      navigate(routePaths.public_dashboard);
    } else {
      setDataUser && setDataUser(token);
    }
  }, []);

  if (!token || token?.role_user !== "admin") {
    return <Navigate to={routePaths.public_dashboard} replace />;
  }

  return <Outlet />;
};
