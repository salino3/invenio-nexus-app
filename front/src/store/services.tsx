import type { FormLoginProps, FormRegisterProps } from "@/utils";
import { VITE_TOKEN, VITE_URL_BACK } from "@/constants";
import { routePaths } from "@/router/routes.interface";
import type {
  PropsCurrentAccount,
  ResponseSearchedCompanies,
  StateLoginDataAccount,
} from "./interface";

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

  //
  public static async refreshToken(): Promise<PropsCurrentAccount | undefined> {
    try {
      const res = await fetch(`${VITE_URL_BACK}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();

      return data;
    } catch (error) {
      console.log("Error refreshing session:", error);
    }
  }

  private static async recoverPassword(email: string): Promise<boolean> {
    try {
      const res = await fetch(`${VITE_URL_BACK}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(email),
      });

      return res.ok;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  // Companies
  public static async getSearchingCompanies(
    searching: string,
    offset: number = 0,
    signal?: AbortSignal,
  ): Promise<ResponseSearchedCompanies | void> {
    try {
      const res = await fetch(`${VITE_URL_BACK}/search-companies`, {
        method: "POST",
        body: JSON.stringify({ searching, offset }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal,
      });

      if (!res.ok) return;

      return await res.json();
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request successfully canceled");
        return;
      }

      console.error("Error while searching for companies:", error);
    }
  }
}
