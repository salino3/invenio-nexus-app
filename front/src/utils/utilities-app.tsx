import { jwtDecode } from "jwt-decode";
import { useProviderSelector } from "@/store/provider";
import type { PropsCurrentAccount } from "@/store/interface";
import { VITE_TOKEN } from "@/constants";
import { routePaths } from "@/router/routes.interface";

export const utilitiesApp = () => {
  const { setDataUser } = useProviderSelector("setDataUser");

  //*
  const getAuthToken = (): PropsCurrentAccount | null => {
    const token = sessionStorage.getItem(VITE_TOKEN);

    if (!token) return null;

    // Verifiying it is divided in 3 parts - header, payload and signature
    if (token && token.split(".").length === 3) {
      try {
        const decoded: any = jwtDecode<PropsCurrentAccount>(token);

        return decoded || null;
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
    } else {
      console.error("Invalid JWT format.");
      return null;
    }
  };

  //*
  const closeSession = (): void => {
    sessionStorage.removeItem(VITE_TOKEN);
    setDataUser && setDataUser(null);

    window.location.href = routePaths?.public_dashboard;
    return;
  };

  //*
  const regexCorrectEmail: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return { getAuthToken, closeSession, regexCorrectEmail };
};
