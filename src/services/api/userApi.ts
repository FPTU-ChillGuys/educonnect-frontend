import axiosInstance from "../axiosInstance";

export interface TeacherLookup {
  userId: string;
  fullName: string;
  email: string;
}

// Interface cho API pagination response
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Interface cho teacher data từ API getUsers với pagination
export interface TeacherFromApi {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  // Các field khác nếu có
}

export interface UserApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors: string[] | null;
}

export const userApi = {
  getUsers: async (params: {
    pageNumber?: number;
    pageSize?: number;
    Role?: string;
    keyword?: string;
    // ... các params khác nếu cần
  }) => {
    const response = await axiosInstance.get("/api/user", { params });
    return response.data;
  },
  // Thêm function để lấy danh sách users theo role (lookup)
  getUsersByRole: async (role: string) => {
    const response = await axiosInstance.get("/api/user/lookup", {
      params: { Role: role },
    });
    return response.data;
  },
  // Thêm function update user
  updateUser: async (
    id: string,
    userData: {
      fullName: string;
      phoneNumber: string;
      address: string;
    }
  ) => {
    const response = await axiosInstance.put(`/api/user/${id}`, userData);
    return response.data;
  },

  // Thêm function toggle user status
  toggleUserStatus: async (id: string, isActive: boolean) => {
    const response = await axiosInstance.patch(`/api/user/${id}/status`, {
      isActive: isActive,
    });
    return response.data;
  },

  getAvailableHomeroomTeachers: async () => {
    const response = await axiosInstance.get("/api/user/lookup", {
      params: { Role: "teacher", IsHomeroomTeacher: false },
    });
    return response.data;
  },

  getTeacherLookup: async (): Promise<UserApiResponse<TeacherLookup[]>> => {
    const response = await axiosInstance.get("/api/user/lookup", {
      params: { Role: "teacher" },
    });
    return response.data;
  },

  // Function mới cho pagination và filter teachers
  getTeachersWithPagination: async (params: {
    pageNumber?: number;
    pageSize?: number;
    keyword?: string; // Có thể search theo name hoặc email
  }): Promise<PaginatedResponse<TeacherFromApi>> => {
    const response = await axiosInstance.get("/api/user", {
      params: {
        Role: "teacher",
        ...params,
      },
    });
    return response.data;
  },
};
