import React, { lazy, Suspense, type JSX } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicRoutes, PrivateRoutes, AdminRoutes } from "./session-routes";
import { MainHeader } from "@/common-app";
import { routePaths, type AppRoute } from "./routes.interface";

// Lazy load the layout components
const PublicDashboardLayout = lazy(
  () => import("../layouts/public-dashboard/public-dashboard.layout"),
);
const RecoverPasswordLayout = lazy(
  () => import("../layouts/recover-password/recover-password.layout"),
);
const ResetPasswordLayout = lazy(
  () => import("../layouts/reset-password/reset-password.layout"),
);
const DashboardLayout = lazy(
  () => import("../layouts/dashboard/dashboard.layout"),
);
const ErrorPageLayout = lazy(
  () => import("../layouts/error-page/error-page.layout"),
);

//
const routes: AppRoute[] = [
  {
    path: routePaths.public_dashboard,
    element: <PublicDashboardLayout />,
    visibility: "public",
  },
  {
    path: routePaths.recover_password,
    element: <RecoverPasswordLayout />,
    visibility: "public",
  },
  {
    path: routePaths.reset_password(":token"),
    element: <ResetPasswordLayout />,
    visibility: "public",
  },
  {
    path: routePaths.dashboard,
    element: <DashboardLayout />,
    visibility: "private",
  },
];

//
const reducedRoutes: Record<string, JSX.Element[]> = routes.reduce(
  (acc, route) => {
    if (!acc[route.visibility]) {
      acc[route.visibility] = [];
    }
    acc[route.visibility].push(
      <Route key={route.path} path={route.path} element={route.element} />,
    );
    return acc;
  },
  {} as Record<string, JSX.Element[]>,
);

const LoadingFallback: React.FC = () => (
  <div
    className="loading-fallback"
    style={{ padding: "2rem", color: "#e1e1e6", textAlign: "center" }}
  >
    <h2>Loading...</h2>
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      {/* <div>X</div> */}

      <MainHeader />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Grupo Public */}
          <Route element={<PublicRoutes />}>{reducedRoutes["public"]}</Route>

          {/* Grupo Private */}
          <Route element={<PrivateRoutes />}>{reducedRoutes["private"]}</Route>

          {/* Grupo Admin */}
          <Route element={<AdminRoutes />}>{reducedRoutes["admin"]}</Route>

          <Route path={routePaths.error_page} element={<ErrorPageLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
