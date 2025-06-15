import { FC } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ROUTES } from "../config/routes";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import SettingPage from "../pages/SettingPage";
import ClassManagementPage from "../pages/admin/ClassManagementPage";
import TeacherManagementPage from "../pages/admin/TeacherManagementPage";
import TimetableManagementPage from "../pages/admin/TimeTableManagementPage";


const AppRoute: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HomePage} element={<HomePage />} />
        <Route path={ROUTES.Login} element={<LoginPage />} />

        <Route path={ROUTES.Dashboard} element={<MainLayout />}>
          {/* Common for both roles */}
          <Route index element={<Dashboard />} />

          {/* Admin-only */}
          <Route
            path={ROUTES.ClassManagement}
            element={<ClassManagementPage />}
          />
          <Route
            path={ROUTES.TimeTable}
            element={<TimetableManagementPage />}
          />
          {/* Teacher-only */}
          <Route
            path={ROUTES.TeacherManagement}
            element={<TeacherManagementPage />}
          />

          {/* Catch-all */}
          <Route path={ROUTES.Setting} element={<SettingPage />} />
          <Route
            path="*"
            element={<Navigate to={ROUTES.Dashboard} replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoute 
