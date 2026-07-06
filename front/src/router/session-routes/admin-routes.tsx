import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import { utilitiesApp } from "@/utils";
import { routePaths } from "../routes.interface";

export const AdminRoutes: React.FC = () => {
  const navigate = useNavigate();

  const { setDataUser } = useProviderSelector("setDataUser");

  const { getAuthToken } = utilitiesApp();

  React.useEffect(() => {
    const token = getAuthToken();
    if (!token || token?.role_user !== "admin") {
      navigate(routePaths.public_dashboard);
    } else {
      setDataUser && setDataUser(token);
    }
  }, []);

  return <Outlet />;
};
