import axiosInstance from '../axiosInstance';

export const userApi = {
  getUsers: async (params: {
    pageNumber?: number;
    pageSize?: number;
    keyword?: string;
    // ... các params khác nếu cần
  }) => {
    const response = await axiosInstance.get('/api/user', { params });
    return response.data;
  }
};
