import type { FormLoginProps } from "@/utils";
import { VITE_TOKEN, VITE_URL_BACK } from "@/constants";
import type { PropsCurrentAccount, StateLoginDataAccount } from "./interface";
import { routePaths } from "@/router/routes.interface";

export class ServicesApp {
  // Auth
  public static async serviceLoginAccount(
    body: FormLoginProps,
  ): Promise<StateLoginDataAccount> {
    const response = await fetch(`${VITE_URL_BACK}/login-account`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data: StateLoginDataAccount = await response.json();

    return data;
  }

  //
  public static async closeSession(
    setDataUser: ((data: PropsCurrentAccount | null) => void) | undefined,
  ): Promise<void> {
    sessionStorage.removeItem(VITE_TOKEN);
    setDataUser && setDataUser(null);

    try {
      fetch(`${VITE_URL_BACK}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch (error) {
      console.error("Errore durante il logout lato server", error);
    }

    window.location.href = routePaths?.public_dashboard;
  }

  //
  public static async checkGoogleSession(): Promise<
    StateLoginDataAccount | undefined
  > {
    try {
      const res = await fetch(`${VITE_URL_BACK}/auth/get-me`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();

      return data;
    } catch (error) {
      console.log("There is not active Google session:", error);
    }
  }
}
