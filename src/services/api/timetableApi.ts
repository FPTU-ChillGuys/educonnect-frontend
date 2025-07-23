import axiosInstance from "../axiosInstance";

// Types cho thời khóa biểu
export interface TimetablePeriod {
  periodNumber: number;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  lessonContent: string;
}

export interface TimetableDay {
  date: string;
  dayOfWeek: string;
  periods: TimetablePeriod[];
}

export interface TimetableResponse {
  data: TimetableDay[];
}

export interface TimetableParams {
  TargetId: string;
  From?: string;
  To?: string;
  Mode: "Teacher" | "Student" | "Class";
}

export const timetableApi = {
  // Lấy thời khóa biểu
  getTimetable: async (params: TimetableParams): Promise<TimetableResponse> => {
    const response = await axiosInstance.get("/api/classsession/timetable", {
      params,
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

  // Lấy thời khóa biểu cho học sinh
  getStudentTimetable: async (
    studentId: string,
    from?: string,
    to?: string
  ): Promise<TimetableResponse> => {
    return timetableApi.getTimetable({
      TargetId: studentId,
      Mode: "Student",
      From: from,
      To: to,
    });
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
};
