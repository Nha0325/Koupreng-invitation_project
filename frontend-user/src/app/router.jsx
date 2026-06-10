import { Routes, Route } from "react-router-dom";

import NotFoundPage from "../pages/marketing/NotFoundPage";
import { adminRoutes } from "./routes/adminRoutes";
import { authRoutes } from "./routes/authRoutes";
import { builderRoutes } from "./routes/builderRoutes";
import { hostRoutes } from "./routes/hostRoutes";
import { marketingRoutes } from "./routes/marketingRoutes";

export default function AppRouter() {
  return (
    <Routes>
      {builderRoutes()}
      {marketingRoutes()}
      {authRoutes()}
      {hostRoutes()}
      {adminRoutes()}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
