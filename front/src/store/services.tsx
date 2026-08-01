import type { FormLoginProps, FormRegisterProps } from "@/utils";
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
      credentials: "include",
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
  public static async registerAccount(body: FormRegisterProps) {
    const response = await fetch(`${VITE_URL_BACK}/register-account`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Register failed with status: ${response.status}`);
    }

    const data: {
      message: string;
      user: Pick<PropsCurrentAccount, "hasAdFreeAccess" | "iat" | "exp">;
    } = await response.json();

    return data;
  }

  //
  public static async closeSession(
    setDataUser: ((data: PropsCurrentAccount | null) => void) | undefined,
  ): Promise<void> {
    try {
      const result = await fetch(`${VITE_URL_BACK}/logout-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!result.ok) {
        return;
      } else {
        sessionStorage.removeItem(VITE_TOKEN);
        setDataUser && setDataUser(null);
        window.location.href = routePaths?.public_dashboard;
      }
    } catch (error) {
      console.error("Server error during logout", error);
    }
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
