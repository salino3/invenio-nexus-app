import type { FormLoginProps } from "@/utils";
import { VITE_URL_BACK } from "@/constants";
import type { StateLoginDataAccount } from "./interface";

export class ServicesApp {
  //
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
}
