import React, { useState } from "react";
import { ModalApp } from "@/common-app";
import { LoginForm, RegisterForm } from "./components";
import { VITE_URL_BACK } from "@/constants";
import "./public-dashboard.styles.scss";

export const PublicDashboard: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
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

      {isLogin ? (
        <LoginForm />
      ) : (
        <RegisterForm setShowModal={setShowModal} setIsLogin={setIsLogin} />
      )}
      <ModalApp
        setShowModal={setShowModal}
        showModal={showModal}
        title="Registration message"
      >
        <strong>Registration successfully completed</strong>
      </ModalApp>
    </div>
  );
};
