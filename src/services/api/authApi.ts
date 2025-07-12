import axiosInstance from '../axiosInstance';

// Types cho Authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'parent';
    avatar?: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'parent';
}

// API functions cho Authentication
export const authApi = {
  // Đăng nhập
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/api/auth/login", credentials);
    return response.data;
  },

  // Đăng ký
  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/api/auth/register", userData);
    return response.data;
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    await axiosInstance.post("/api/auth/logout");
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: async (): Promise<LoginResponse['user']> => {
    const response = await axiosInstance.get("/api/auth/me");
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await axiosInstance.post("/api/auth/refresh");
    return response.data;
  },
}; 