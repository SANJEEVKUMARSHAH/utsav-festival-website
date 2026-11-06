import React from "react";
import { StaticRouter } from "react-router-dom/server";
import AppRoutes from "./AppRoutes";

export function render(url) {
  return (
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  );
}
