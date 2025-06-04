export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  MAIN_LAYOUT: "/dashboard",
} as const;

// Định nghĩa kiểu cho routes
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];

// Hàm helper để lấy route
export const getRoute = (key: RouteKey): RouteValue => ROUTES[key];
