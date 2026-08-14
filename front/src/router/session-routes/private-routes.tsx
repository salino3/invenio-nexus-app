import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import { ServicesApp } from "@/store/services";
import type { PropsCurrentAccount } from "@/store/interface";
import { utilitiesApp } from "@/utils";
import { Aside } from "@/common-app";
import { routePaths } from "../routes.interface";
import "../../App.scss";

const REFRESH_OFFSET_MS: number = 5 * 60 * 1000; // 5 minutes in ms

export const PrivateRoutes: React.FC = () => {
  const { setDataUser, currentUser } = useProviderSelector(
    "setDataUser",
    "currentUser",
  );

  const { getAuthToken } = utilitiesApp();

  const token: PropsCurrentAccount | null = getAuthToken();
  React.useEffect(() => {
    if (token && !currentUser && setDataUser) {
      setDataUser(token);
    }
  }, [token?.id, currentUser, setDataUser]);

  // Schedule Token Refresh 5 minutes before expiration
  React.useEffect(() => {
    if (!token?.exp) return;

    const expiryTimeMs: number = token.exp * 1000;
    const nowMs: number = Date.now();

    // Calculate time remaining until 5 min before expiry
    const timeUntilRefresh: number = expiryTimeMs - nowMs - REFRESH_OFFSET_MS;

    let timerId: ReturnType<typeof setTimeout>;

    if (timeUntilRefresh > 0) {
      // Schedule the refresh call
      timerId = setTimeout(async () => {
        try {
          console.log("Refreshing token 5 minutes before expiry...");
          await ServicesApp.refreshToken();
        } catch (error) {
          console.error("Failed to auto-refresh token:", error);
        }
      }, timeUntilRefresh);
    } else {
      // Less than 5 minutes remain right now: refresh immediately
      ServicesApp.refreshToken().catch((err) =>
        console.error("Immediate refresh failed:", err),
      );
    }

    // Cleanup timer on unmount or token change
    return () => clearTimeout(timerId);
  }, [token?.exp]);

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
