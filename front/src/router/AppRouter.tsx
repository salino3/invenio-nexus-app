import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTE_PATHS, type AppRoute } from "./routes.interface";

// Lazy load the layout components
const DashboardLayout = lazy(
  () => import("../layouts/dashboard/dashboard.layout"),
);
const ChartsLayout = lazy(() => import("../layouts/charts/charts.layout"));
const ErrorPageLayout = lazy(
  () => import("../layouts/error-page/error-page.layout"),
);

const LoadingFallback: React.FC = () => (
  <div
    className="loading-fallback"
    style={{ padding: "2rem", color: "#e1e1e6", textAlign: "center" }}
  >
    <h2>Loading...</h2>
  </div>
);

const routes: AppRoute[] = [
  { path: ROUTE_PATHS.DASHBOARD, element: <DashboardLayout /> },
  { path: ROUTE_PATHS.CHARTS, element: <ChartsLayout /> },
];

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {routes.map((route: AppRoute) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path={ROUTE_PATHS.ERROR_PAGE} element={<ErrorPageLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
