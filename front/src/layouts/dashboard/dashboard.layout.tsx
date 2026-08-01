import React, { useLayoutEffect } from "react";
import { ServicesApp } from "@/store/services";
import { useProviderSelector } from "@/store/provider";
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
        console.log("clog5", data);
        if (data.token) {
          sessionStorage.setItem(VITE_TOKEN, data.token);
        }
        if (data.user) {
          setDataUser?.(data.user);
        }
      }
    });
  };

  useLayoutEffect(() => {
    if (!currentUser?.hasAdFreeAccess) {
      checkGoogleSession();
    }
  }, [setDataUser, currentUser?.hasAdFreeAccess]);

  return (
    <div className="rootDashboardLayout data-theme light">DashboardLayout</div>
  );
};

export default DashboardLayout;
