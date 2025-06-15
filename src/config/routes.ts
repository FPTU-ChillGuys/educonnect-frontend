export const ROUTES = {
  HomePage: "/",
  Login: "/login",
  Dashboard: "/dashboard",
  Setting: "setting",
  ClassManagement: "class-management",
  TeacherManagement: "teacher-management",
  TimeTable: "timetable",
} as const;

// Định nghĩa kiểu cho routes
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];

// Hàm helper để lấy route
export const getRoute = (key: RouteKey): RouteValue => ROUTES[key];
