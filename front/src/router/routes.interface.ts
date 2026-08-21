import React from "react";

type EnumVisibility = "public" | "private" | "restricted" | "admin";

export interface RoutePaths {
  public_dashboard: string;
  recover_password: string;
  reset_password: (token: string) => string;
  dashboard: string;
  error_page: string;
  //
  new_company: string;
}

export const routePaths: RoutePaths = {
  public_dashboard: "/",
  recover_password: "/recover_password",
  reset_password: (token: string) => `/reset-password/${token}`,
  dashboard: "/dashboard",
  error_page: "*",
  //
  new_company: "/new-company",
};

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  visibility: EnumVisibility;
}
