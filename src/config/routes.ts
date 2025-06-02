export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
} as const

// Định nghĩa kiểu cho routes
export type RouteKey = keyof typeof ROUTES
export type RouteValue = typeof ROUTES[RouteKey]

// Hàm helper để lấy route
export const getRoute = (key: RouteKey): RouteValue => ROUTES[key] 