export const ROUTES = {
  HomePage: "/",
  Login: "/login",
  Dashboard: "/dashboard",
  Setting: "setting",

  // Admin routes
  UserManagement: "user-management",
  ClassManagement: "class-management",
  TeacherManagement: "teacher-management",
  TimeTable: "timetable",

  // Teacher routes
  TeacherSchedule: "teacher-schedule",
  TeacherClass: "teacher-class",

  // Parent routes
  ParentMobileApp: "/parent-mobile-app",
} as const;

// Định nghĩa kiểu cho routes
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];

// Hàm helper để lấy route
export const getRoute = (key: RouteKey): RouteValue => ROUTES[key];
