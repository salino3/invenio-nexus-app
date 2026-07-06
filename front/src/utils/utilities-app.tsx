import type { PropsCurrentAccount } from "@/store/interface";
import { jwtDecode } from "jwt-decode";

export const utilitiesApp = () => {
  //*
  const getAuthToken = (): PropsCurrentAccount | null => {
    const cookies = document.cookie.split("; ");
    const authCookie = cookies.find((cookie) =>
      cookie.startsWith(import.meta.env.VITE_APP_COOKIE_AUTH),
    );

    if (!authCookie) return null;

    const authCookieSplitted = authCookie.split("=")[1];

    // Verifiying it is divided in 3 parts - header, payload and signature
    if (authCookieSplitted && authCookieSplitted.split(".").length === 3) {
      try {
        const decoded: any = jwtDecode(authCookieSplitted);

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
  const regexCorrectEmail: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return { getAuthToken, regexCorrectEmail };
};
