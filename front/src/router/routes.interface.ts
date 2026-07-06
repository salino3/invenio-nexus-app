import React from "react";

type EnumVisibility = "public" | "private" | "restricted" | "admin";

export interface RoutePaths {
  public_dashboard: string;
  dashboard: string;
  error_page: string;
}

export const routePaths: RoutePaths = {
  public_dashboard: "/",
  dashboard: "/dashboard",
  error_page: "*",
};

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  visibility: EnumVisibility;
}
