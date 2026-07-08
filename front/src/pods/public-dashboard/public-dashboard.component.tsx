import { useEffect, useState } from "react";
import type React from "react";
import { LoginForm } from "./components";
import "./public-dashboard.styles.scss";
import { useNavigate } from "react-router-dom";
import { VITE_TOKEN } from "@/constants";
import { routePaths } from "@/router/routes.interface";
import { useProviderSelector } from "@/store/provider";

export const PublicDashboard: React.FC = () => {
  const { setDataUser } = useProviderSelector("setDataUser");

  const [isLogin, setIsLogin] = useState<boolean>(true);

  const loginWithGoogle = () => {
    // Redirige la ventana completa al backend
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Verificamos si existe la cookie llamando a /me
    fetch("http://localhost:8000/api/auth/get-me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // ⚠️ CRUCIAL: 'include' le dice al navegador que envíe la Cookie HTTP-Only
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autenticado");
        return res.json();
      })
      .then((data) => {
        console.log("clog2", data);
        setDataUser && setDataUser(data.user);
        sessionStorage.setItem(VITE_TOKEN, data.token);
      });
  }, [navigate]);

  return (
    <div className="rootPublicDashboard">
      <h1 className="titlePagePD">Public Dashboard Layout</h1>
      <button onClick={() => loginWithGoogle()}>click</button>
      <div className="boxButtonsPage">
        <button onClick={() => setIsLogin(true)}>Login</button>
        <button onClick={() => setIsLogin(false)}>Register</button>
      </div>

      {isLogin ? <LoginForm /> : "Register component"}
    </div>
  );
};
