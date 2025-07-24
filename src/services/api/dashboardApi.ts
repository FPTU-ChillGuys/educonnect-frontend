import axiosInstance from '../axiosInstance';

// Types cho Dashboard
export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  totalHomeroomTeachers: number;
  totalSubjectTeachers: number;
}

// API functions cho Dashboard
export const dashboardApi = {
  // Lấy tổng số lớp học
  getTotalClass: async () => {
    const response = await axiosInstance.get("/api/class/count");
    return response.data.data;
  },

  // Lấy tổng số học sinh
  getTotalStudent: async ()=> {
    const response = await axiosInstance.get("/api/student/count");
    return response.data.data;
  },

  // Lấy tổng số giáo viên chủ nhiệm
  getTotalHomeroomTeacher: async () => {
    const response = await axiosInstance.get("/api/user/count/homeroom-teachers");
    return response.data.data;
  },

  // Lấy tổng số giáo viên bộ môn
  getTotalSubjectTeacher: async () => {
    const response = await axiosInstance.get("/api/user/count/subject-teachers");
    return response.data.data;
  },

  // Lấy tất cả thống kê dashboard
  getAllStats: async () => {
    const [totalClasses, totalStudents, totalHomeroomTeachers, totalSubjectTeachers] = await Promise.all([
      dashboardApi.getTotalClass(),
      dashboardApi.getTotalStudent(),
      dashboardApi.getTotalHomeroomTeacher(),
      dashboardApi.getTotalSubjectTeacher(),
    ]);

    return {
      totalClasses,
      totalStudents,
      totalHomeroomTeachers,
      totalSubjectTeachers,
    };
  },
}; 