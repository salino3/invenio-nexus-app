import { PublicDashboard } from "@/pods";
import { useEffect } from "react";
import { useProviderSelector } from "@/store/provider";
import { ServicesApp } from "@/store/services";
import { VITE_TOKEN } from "@/constants";
import "./public-dashboard.styles.scss";

const PublicDashboardLayout: React.FC = () => {
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
    if (currentUser?.email) checkGoogleSession();
  }, []);

  return (
    <div className="rootPublicDashboardLayout">
      <PublicDashboard />
    </div>
  );
};

export default PublicDashboardLayout;
