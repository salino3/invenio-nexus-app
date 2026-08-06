import React, { useEffect } from "react";
import { ServicesApp } from "@/store/services";
import { useProviderSelector } from "@/store/provider";
import { Dashboard } from "@/pods";
import { VITE_TOKEN } from "@/constants";
import "./dashboard.styles.scss";

const DashboardLayout: React.FC = () => {
  const { setDataUser, currentUser } = useProviderSelector(
    "setDataUser",
    "currentUser",
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

  return (
    <div className="rootDashboardLayout">
      <Dashboard />
    </div>
  );
};

export default DashboardLayout;
