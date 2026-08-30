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
  company_by_uuid: (name: string, uuid: string) => string;
}

export const routePaths: RoutePaths = {
  public_dashboard: "/",
  recover_password: "/recover_password",
  reset_password: (token: string) => `/reset-password/${token}`,
  dashboard: "/dashboard",
  error_page: "*",
  //
  new_company: "/new-company",
  company_by_uuid: (name: string, uuid: string) => `/company/${name}/${uuid}`,
};

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  visibility: EnumVisibility;
}
