import { VITE_URL_BACK } from "@/constants";
import type { PropsCurrentAccount } from "./interface";

export class ServicesApp {
  //
  public static async serviceLoginAccount(
    email: string,
    password: string,
  ): Promise<PropsCurrentAccount> {
    const response = await fetch(VITE_URL_BACK, {
      method: "POST",
      body: JSON.stringify({ email, password }),
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

    const data: PropsCurrentAccount = await response.json();
    return data;
  }
}
