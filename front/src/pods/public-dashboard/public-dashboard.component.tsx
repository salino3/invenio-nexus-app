import { useState } from "react";
import type React from "react";
import { LoginForm } from "./components";
import "./public-dashboard.styles.scss";

export const PublicDashboard: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="rootPublicDashboard">
      <h1 className="titlePagePD">Public Dashboard Layout</h1>

      <div className="boxButtonsPage">
        <button onClick={() => setIsLogin(true)}>Login</button>
        <button onClick={() => setIsLogin(false)}>Register</button>
      </div>

      {isLogin ? <LoginForm /> : "Register component"}
    </div>
  );
};
