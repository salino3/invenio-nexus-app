import React, { useState } from "react";
import { LoginForm, RegisterForm } from "./components";
import { VITE_URL_BACK } from "@/constants";
import "./public-dashboard.styles.scss";

export const PublicDashboard: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const loginWithGoogle = () => {
    window.location.href = `${VITE_URL_BACK}/auth/google`;
  };

  return (
    <div className="rootPublicDashboard">
      <h1 className="titlePagePD">Public Dashboard Layout</h1>
      <button onClick={() => loginWithGoogle()}>click</button>
      <div className="boxButtonsPage">
        <button onClick={() => setIsLogin(true)}>Login</button>
        <button onClick={() => setIsLogin(false)}>Register</button>
      </div>

      {isLogin ? <LoginForm /> : <RegisterForm setIsLogin={setIsLogin} />}
    </div>
  );
};
