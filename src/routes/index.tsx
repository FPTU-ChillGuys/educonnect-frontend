import { FC } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { ROUTES } from "../config/routes";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import SettingPage from "../pages/SettingPage";
import ClassManagementPage from "../pages/admin/ClassManagementPage";
import TeacherManagementPage from "../pages/admin/TeacherManagementPage";
import TimetableManagementPage from "../pages/admin/TimeTableManagementPage";
import TeacherSchedulePage from "../pages/teacher/TeacherSchedulePage";
import TeacherClassPage from "../pages/teacher/TeacherClassPage";


// Kiểm tra xem người dùng đã đăng nhập chưa
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  try {
    // Kiểm tra token hết hạn
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Lấy role của người dùng từ token
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch {
    return null;
  }
};

// Component bảo vệ route yêu cầu đăng nhập
const PrivateRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Lưu lại đường dẫn hiện tại để sau khi đăng nhập có thể quay lại
    return <Navigate to={ROUTES.Login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Component bảo vệ route chỉ cho phép admin truy cập
const AdminRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const role = getUserRole();

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.Login} state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    return <Navigate to={ROUTES.Dashboard} replace />;
  }

  return <>{children}</>;
};

// Component bảo vệ route chỉ cho phép teacher truy cập
const TeacherRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const role = getUserRole();

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.Login} state={{ from: location }} replace />;
  }

  if (role !== "teacher") {
    return <Navigate to={ROUTES.Dashboard} replace />;
  }

  return <>{children}</>;
};

const AppRoute: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.HomePage} element={<HomePage />} />
        <Route path={ROUTES.Login} element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path={ROUTES.Dashboard}
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* Common routes */}
          <Route index element={<Dashboard />} />
          <Route path={ROUTES.Setting} element={<SettingPage />} />

          {/* Admin routes */}
          <Route
            path={ROUTES.ClassManagement}
            element={
              <AdminRoute>
                <ClassManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.TimeTable}
            element={
              <AdminRoute>
                <TimetableManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.TeacherManagement}
            element={
              <AdminRoute>
                <TeacherManagementPage />
              </AdminRoute>
            }
          />

          {/* Teacher routes */}
          <Route
            path={ROUTES.TeacherSchedule}
            element={
              <TeacherRoute>
                <TeacherSchedulePage />
              </TeacherRoute>
            }
          />
          <Route
            path={ROUTES.TeacherClass}
            element={
              <TeacherRoute>
                <TeacherClassPage />
              </TeacherRoute>
            }
          />

          {/* Catch all route */}
          <Route
            path="*"
            element={<Navigate to={ROUTES.Dashboard} replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoute; 
