import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { utilitiesApp } from "@/utils";
import type { PropsCurrentAccount } from "@/store/interface";
import { Aside } from "@/common-app";
import { Configurations } from "@/components";
import { routePaths } from "../routes.interface";
import "../../App.scss";

export const PublicRoutes: React.FC = () => {
  const { getAuthToken } = utilitiesApp();

  const token: PropsCurrentAccount | null = getAuthToken();
  const isAuthenticated: boolean | null = token && !!token.id;

  if (isAuthenticated) {
    return <Navigate to={routePaths.dashboard} replace />;
  }

  return (
    <div className="rootRouter">
      <Aside />
      <Outlet />
      <Configurations />
    </div>
  );
};
