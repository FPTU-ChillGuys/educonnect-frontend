import { FC } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ROUTES } from "../config/routes";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";


const AppRoute: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.MAIN_LAYOUT} element={<MainLayout />}>
          {/* Define nested routes here if needed */}
          <Route index element={<Dashboard />} />
          {/* Add other nested routes as needed */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoute 
