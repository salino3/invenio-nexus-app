import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicDashboard } from "@/pods";
import { useProviderSelector } from "@/store/provider";
import { ServicesApp } from "@/store/services";
import { routePaths } from "@/router/routes.interface";
import { VITE_TOKEN } from "@/constants";
import "./public-dashboard.styles.scss";

const PublicDashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { setDataUser, currentUser } = useProviderSelector(
    "setDataUser",
    "currentUser",
  );

  // 1. Detect if returning from Google on mount
  const hasGoogleParams: boolean =
    document.referrer.includes("accounts.google") ||
    window.location.search.includes("code=") ||
    window.location.hash.includes("code=") ||
    window.location.hash.includes("access_token=");

  // 2. Track authenticating status in React State
  const [isAuthenticatingGoogle, setIsAuthenticatingGoogle] =
    useState<boolean>(hasGoogleParams);

  const checkGoogleSession = async () => {
    ServicesApp.checkGoogleSession()
      .then((data) => {
        if (data) {
          if (data.token) {
            sessionStorage.setItem(VITE_TOKEN, data.token);
          }
          if (data.user) {
            setDataUser?.(data.user);
          }

          // Clean up URL parameters (removes ?code=... from URL bar)
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          navigate(routePaths.dashboard);
        }
      })
      .finally(() => setIsAuthenticatingGoogle(false));
  };

  useEffect(() => {
    if (currentUser?.email || isAuthenticatingGoogle) checkGoogleSession();
  }, []);

  return (
    <div className="rootPublicDashboardLayout">
      {hasGoogleParams || isAuthenticatingGoogle ? (
        "Loading..."
      ) : (
        <PublicDashboard />
      )}
    </div>
  );
};

export default PublicDashboardLayout;
