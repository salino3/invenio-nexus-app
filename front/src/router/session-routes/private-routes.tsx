import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import type { PropsCurrentAccount } from "@/store/interface";
import { utilitiesApp } from "@/utils";
import { Aside } from "@/common-app";
import { routePaths } from "../routes.interface";
import "../../App.scss";

export const PrivateRoutes: React.FC = () => {
  const { setDataUser, currentUser } = useProviderSelector(
    "setDataUser",
    "currentUser",
  );

  const { getAuthToken } = utilitiesApp();

  const token: PropsCurrentAccount | null = getAuthToken();
  React.useEffect(() => {
    if (token && setDataUser) {
      setDataUser(token);
    }
  }, [token, setDataUser]);

  if (!token) {
    return <Navigate to={routePaths.public_dashboard} replace />;
  }

  return (
    <div className="rootRouter">
      {!currentUser?.hasAdFreeAccess && <Aside />}
      <Outlet />
    </div>
  );
};
