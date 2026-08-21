import React, { useEffect } from "react";
import { ServicesApp } from "@/store/services";
import { useProviderSelector } from "@/store/provider";
import { Dashboard } from "@/pods";
import { VITE_TOKEN } from "@/constants";
import "./dashboard.styles.scss";

const DashboardLayout: React.FC = () => {
  const { setDataUser, currentUser, setDataMyCompanies } = useProviderSelector(
    "setDataUser",
    "currentUser",
    "setDataMyCompanies",
  );

  const checkGoogleSession = async () => {
    ServicesApp.checkGoogleSession().then((data) => {
      if (data) {
        if (data.token) {
          sessionStorage.setItem(VITE_TOKEN, data.token);
        }
        if (data.user) {
          setDataUser?.(data.user);
        }
      }
    });
  };

  useEffect(() => {
    if (!currentUser?.hasAdFreeAccess) {
      checkGoogleSession();
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    ServicesApp.getMycompanies(controller.signal).then(
      (res) => setDataMyCompanies && setDataMyCompanies(res),
    );

    // If endpoint is done, automatically there is not execution for 'controller.abort'
    return () => controller.abort();
  }, []);

  return (
    <div className="rootDashboardLayout">
      <Dashboard />
    </div>
  );
};

export default DashboardLayout;
