import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { utilitiesApp } from "@/utils";
import { routePaths } from "../routes.interface";
import { useProviderSelector } from "@/store/provider";

export const PublicRoutes: React.FC = () => {
  const navigate = useNavigate();

  const { currentUser } = useProviderSelector("currentUser");

  const { getAuthToken, closeSession } = utilitiesApp();

  const token = getAuthToken();
  React.useEffect(() => {
    if (token && token?.id) {
      navigate(routePaths.dashboard);
    } else {
      if (currentUser?.email) {
        closeSession && closeSession();
      }
    }
  }, []);

  return <Outlet />;
};
