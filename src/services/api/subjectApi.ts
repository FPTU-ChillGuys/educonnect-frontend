import axiosInstance from "../axiosInstance";

export interface SubjectLookup {
  subjectId: string;
  subjectName: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors: string[] | null;
}

export const subjectApi = {
  getSubjectLookup: async (): Promise<ApiResponse<SubjectLookup[]>> => {
    const response = await axiosInstance.get("/api/subject/lookup");
    return response.data;
  },
};
