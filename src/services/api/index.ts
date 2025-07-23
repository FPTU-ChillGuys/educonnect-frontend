// Export tất cả các API services
export * from "../api/authApi";
export * from "../api/classApi";
export * from "../api/dashboardApi";
export * from "../api/timetableApi";

// Export userApi riêng để tránh conflict
export { userApi } from "../api/userApi";
export type {
  TeacherLookup,
  TeacherFromApi,
  PaginatedResponse,
} from "../api/userApi";
