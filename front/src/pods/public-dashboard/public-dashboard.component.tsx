import { useState } from "react";
import type React from "react";
import { LoginForm } from "./components";
import "./public-dashboard.styles.scss";

export const PublicDashboard: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  console.log("clog3", import.meta.env.VITE_URL_BACK);
  return (
    <div className="rootPublicDashboard">
      <h1>PublicDashboardLayout</h1>

      <div className="boxButtonsPage">
        <button onClick={() => setIsLogin(true)}>Login</button>
        <button onClick={() => setIsLogin(false)}>Register</button>
      </div>

      {isLogin ? <LoginForm /> : "Register component"}
    </div>
  );
};
