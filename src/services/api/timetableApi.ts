import axiosInstance from "../axiosInstance";

// Utility function to convert date format from YYYY-MM-DD to MM/DD/YYYY
const formatDateToAPI = (dateString: string): string => {
  // Parse the date in YYYY-MM-DD format
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
};

// Types cho thời khóa biểu
export interface TimetablePeriod {
  classSessionId: string;
  periodNumber: number;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  lessonContent: string;
  generalBehaviorNote?: string;
  totalAbsentStudents: number;
}

export interface TimetableDay {
  date: string;
  dayOfWeek: string;
  periods: TimetablePeriod[];
}

export interface TimetableResponse {
  success: boolean;
  data: TimetableDay[];
  message?: string;
}

export interface TimetableParams {
  TargetId: string;
  From?: string;
  To?: string;
  Mode: "Teacher" | "Student" | "Class";
}

// Types for class info
export interface ClassInfo {
  classId: string;
  gradeLevel: string;
  className: string;
  academicYear: string;
  homeroomTeacherId: string;
  homeroomTeacherName: string;
}

export interface ClassResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  data: ClassInfo[];
  success: boolean;
  message: string;
  errors: null | string[];
}

export const timetableApi = {
  // Lấy thời khóa biểu
  getTimetable: async (params: TimetableParams): Promise<TimetableResponse> => {
    // Format dates to MM/DD/YYYY if provided
    const formattedParams = { ...params };
    if (formattedParams.From) {
      formattedParams.From = formatDateToAPI(formattedParams.From);
    }
    if (formattedParams.To) {
      formattedParams.To = formatDateToAPI(formattedParams.To);
    }

    const response = await axiosInstance.get("/api/classsession/timetable", {
      params: formattedParams,
    });
    return response.data;
  },

  // Lấy thời khóa biểu cho giáo viên
  getTeacherTimetable: async (
    teacherId: string,
    from?: string,
    to?: string
  ): Promise<TimetableResponse> => {
    return timetableApi.getTimetable({
      TargetId: teacherId,
      Mode: "Teacher",
      From: from,
      To: to,
    });
  },

  // Lấy thời khóa biểu cho học sinh/lớp
  getStudentTimetable: async (
    classId: string,
    from?: string,
    to?: string
  ): Promise<TimetableResponse> => {
    const result = await timetableApi.getTimetable({
      TargetId: classId,
      Mode: "Class",
      From: from,
      To: to,
    });

    return result;
  },

  // Lấy thời khóa biểu cho lớp
  getClassTimetable: async (
    classId: string,
    from?: string,
    to?: string
  ): Promise<TimetableResponse> => {
    return timetableApi.getTimetable({
      TargetId: classId,
      Mode: "Class",
      From: from,
      To: to,
    });
  },

  // Get homeroom classes for a teacher
  getHomeroomClasses: async (
    teacherId: string,
    pageSize: number = 10
  ): Promise<ClassResponse> => {
    const response = await axiosInstance.get("/api/class", {
      params: {
        TeacherId: teacherId,
        PageSize: pageSize,
      },
    });

    return response.data;
  },

  // Update class session for teacher
  updateClassSession: async (
    classSessionId: string,
    updates: {
      lessonContent?: string;
      totalAbsentStudents?: number;
      generalBehaviorNote?: string;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.put(
      `/api/classsession/teacher/${classSessionId}`,
      updates
    );
    return response.data;
  },
};
