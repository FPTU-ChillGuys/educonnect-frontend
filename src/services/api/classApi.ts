import axiosInstance from '../axiosInstance';

// Types cho Class Management
export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  homeroomTeacherId: string;
  homeroomTeacherName: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassRequest {
  name: string;
  grade: string;
  homeroomTeacherId: string;
}

export interface UpdateClassRequest {
  name?: string;
  grade?: string;
  homeroomTeacherId?: string;
}

// API functions cho Class Management
export const classApi = {
  
  // Lấy danh sách tất cả học sinhc
  getStudents: async (params: {
      pageNumber?: number;
      pageSize?: number;
      keyword?: string;
      classId?: string;
      status?: string;
      gender?: string;
      fromDate?: string;
      toDate?: string;
      sortBy?: string;
      sortDescending?: boolean;
    }) => {
      const response = await axiosInstance.get("/api/student", { params });
      return response.data; // trả về object như bạn gửi ở trên
  },
  
  // Lấy danh sách tất cả lớp học
  getAllClasses: async (): Promise<Class[]> => {
    const response = await axiosInstance.get("/api/class");
    return response.data.data;
  },

  // Lấy thông tin một lớp học theo ID
  getClassById: async (id: string): Promise<Class> => {
    const response = await axiosInstance.get(`/api/class/${id}`);
    return response.data.data;
  },

  // Tạo lớp học mới
  createClass: async (classData: CreateClassRequest): Promise<Class> => {
    const response = await axiosInstance.post("/api/class", classData);
    return response.data.data;
  },

  // Cập nhật thông tin lớp học
  updateClass: async (id: string, classData: UpdateClassRequest): Promise<Class> => {
    const response = await axiosInstance.put(`/api/class/${id}`, classData);
    return response.data;
  },

  // Xóa lớp học
  deleteClass: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/class/${id}`);
  },

  // Lấy danh sách học sinh trong lớp
  getClassStudents: async (classId: string): Promise<Student[]> => {
    const response = await axiosInstance.get(`/api/class/${classId}/students`);
    return response.data;
  },

  // Thêm học sinh vào lớp
  addStudentToClass: async (classId: string, studentId: string): Promise<void> => {
    await axiosInstance.post(`/api/class/${classId}/students`, { studentId });
  },

  // Xóa học sinh khỏi lớp
  removeStudentFromClass: async (classId: string, studentId: string): Promise<void> => {
    await axiosInstance.delete(`/api/class/${classId}/students/${studentId}`);
  },
}; 