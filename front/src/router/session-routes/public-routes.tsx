import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { utilitiesApp } from "@/utils";
import type { PropsCurrentAccount } from "@/store/interface";
import { routePaths } from "../routes.interface";
import { useProviderSelector } from "@/store/provider";

export const PublicRoutes: React.FC = () => {
  const { currentUser } = useProviderSelector("currentUser");
  const { getAuthToken, closeSession } = utilitiesApp();

  const token: PropsCurrentAccount | null = getAuthToken();
  const isAuthenticated: boolean | null = token && !!token.id;

  React.useEffect(() => {
    if (!isAuthenticated && currentUser?.email) {
      closeSession?.();
    }
  }, [isAuthenticated, currentUser, closeSession]);

  if (isAuthenticated) {
    return <Navigate to={routePaths.dashboard} replace />;
  }

  return <Outlet />;
};
