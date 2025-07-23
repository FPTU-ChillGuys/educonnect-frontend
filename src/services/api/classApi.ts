import axiosInstance from "../axiosInstance";
import { ClassApiResponse } from "../../types";

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

export interface ClassLookup {
  classId: string;
  className: string;
}

export interface ClassSession {
  classSessionId: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
  periodId: string;
  periodNumber: number;
  date: string;
  lessonContent: string;
  totalAbsentStudents: number;
  generalBehaviorNote: string | null;
  isDeleted: boolean;
}

export interface ClassSessionParams {
  ClassId: string;
  PageNumber?: number;
  PageSize?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors: string[] | null;
}

export interface UpdateClassRequest {
  name?: string;
  grade?: string;
  homeroomTeacherId?: string;
}

// Type cho update student request
export interface UpdateStudentRequest {
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  classId: string;
  parentId: string;
  avatar?: File;
}

// Type cho create student request
export interface CreateStudentRequest {
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  classId: string;
  parentId: string;
  avatar?: File;
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

export interface CreateClassSessionRequest {
  classId: string;
  teacherId: string;
  subjectId: string;
  periodId: string;
  date: string;
  lessonContent: string;
  generalBehaviorNote: string;
  totalAbsentStudents: number;
}

export interface UpdateClassSessionRequest {
  sessionId: string;
  classId: string;
  teacherId: string;
  subjectId: string;
  periodId: string;
  date: string;
  lessonContent: string;
  generalBehaviorNote: string;
  totalAbsentStudents: number;
  isDeleted: boolean;
}

export interface PeriodLookup {
  periodId: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
}

// API functions cho Class Management
export const classApi = {
  // Lấy danh sách lớp
  getClasses: async (params?: {
    Keyword?: string;
    TeacherId?: string;
    StudentId?: string;
    PageNumber?: number;
    PageSize?: number;
    SortBy?: string;
    SortDescending?: boolean;
  }): Promise<ClassApiResponse> => {
    const response = await axiosInstance.get("/api/class", { params });
    return response.data;
  },

  // Lấy danh sách học sinh
  getStudents: async (params: {
    pageNumber: number;
    pageSize: number;
    Keyword?: string;
    ClassId?: string;
    ParentId?: string;
    Status?: string;
    Gender?: string;
    FromDate?: string;
    ToDate?: string;
    SortBy?: string;
    SortDescending?: boolean;
  }) => {
    const response = await axiosInstance.get("/api/student", { params });
    return response.data;
  },

  // Cập nhật thông tin học sinh
  updateStudent: async (studentId: string, data: UpdateStudentRequest) => {
    const formData = new FormData();

    // Append các field bắt buộc
    formData.append("StudentCode", data.studentCode);
    formData.append("FullName", data.fullName);
    formData.append("DateOfBirth", data.dateOfBirth);
    formData.append("Gender", data.gender);
    formData.append("Status", data.status);
    formData.append("ClassId", data.classId);
    formData.append("ParentId", data.parentId);

    // Append avatar nếu có
    if (data.avatar) {
      formData.append("Avatar", data.avatar);
    }

    const response = await axiosInstance.put(
      `/api/student/${studentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // API tạo lớp học mới
  createClass: async (data: {
    gradeLevel: string;
    className: string;
    academicYear: string;
    homeroomTeacherId: string;
  }) => {
    const response = await axiosInstance.post("/api/class", data);
    return response.data;
  },

  // API tạo học sinh mới
  createStudent: async (data: CreateStudentRequest) => {
    const formData = new FormData();

    // Append các field bắt buộc
    formData.append("StudentCode", data.studentCode);
    formData.append("FullName", data.fullName);
    formData.append("DateOfBirth", data.dateOfBirth);
    formData.append("Gender", data.gender);
    formData.append("Status", data.status);
    formData.append("ClassId", data.classId);
    formData.append("ParentId", data.parentId);

    // Append avatar nếu có
    if (data.avatar) {
      formData.append("Avatar", data.avatar);
    }

    const response = await axiosInstance.post("/api/student", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  getClassLookup: async (): Promise<ApiResponse<ClassLookup[]>> => {
    const response = await axiosInstance.get("/api/class/lookup");
    return response.data;
  },

  getClassSessions: async (
    params: ClassSessionParams
  ): Promise<ApiResponse<ClassSession[]>> => {
    const response = await axiosInstance.get("/api/classsession", { params });
    return response.data;
  },

  createClassSession: async (
    data: CreateClassSessionRequest
  ): Promise<ApiResponse<ClassSession>> => {
    const response = await axiosInstance.post("/api/classsession", {
      classId: data.classId,
      subjectId: data.subjectId,
      teacherId: data.teacherId,
      date: data.date,
      periodId: data.periodId,
      lessonContent: data.lessonContent,
      generalBehaviorNote: data.generalBehaviorNote || null,
    });
    return response.data;
  },

  updateClassSession: async (
    params: UpdateClassSessionRequest
  ): Promise<ApiResponse<ClassSession>> => {
    const response = await axiosInstance.put(
      `/api/classsession/admin/${params.sessionId}`,
      params
    );
    return response.data;
  },

  getPeriodLookup: async (): Promise<ApiResponse<PeriodLookup[]>> => {
    const response = await axiosInstance.get("/api/period/lookup");
    return response.data;
  },
};
