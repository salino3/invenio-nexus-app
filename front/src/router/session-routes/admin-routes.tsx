import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import type { PropsCurrentAccount } from "@/store/interface";
import { utilitiesApp } from "@/utils";
import { Aside } from "@/common-app";
import { routePaths } from "../routes.interface";
import "../../App.scss";

export const AdminRoutes: React.FC = () => {
  const { setDataUser } = useProviderSelector("setDataUser");
  const { getAuthToken } = utilitiesApp();

  const token: PropsCurrentAccount | null = getAuthToken();
  const isAdmin: boolean | null = token && token.role_user === "admin";

  React.useEffect(() => {
    if (isAdmin && setDataUser) {
      setDataUser(token);
    }
  }, [isAdmin, token, setDataUser]);

  if (!isAdmin) {
    return <Navigate to={routePaths.public_dashboard} replace />;
  }

  return (
    <div className="rootRouter">
      <Aside />
      <Outlet />
    </div>
  );
};
