// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  teacherInfo?: TeacherInfo;
}

export type UserRole = "admin" | "teacher";

export interface TeacherInfo {
  employeeId: string;
  subjects: Subject[];
  homeroomClassId?: string; // Optional - only if they are a homeroom teacher
  teachingClasses: string[]; // Classes they teach subjects in
}

// School Structure Types
export interface Class {
  id: string;
  name: string;
  grade: number;
  homeroomTeacherId?: string;
  academicYear: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  classId: string;
  dateOfBirth: string;
  gender: "male" | "female";
  address?: string;
  parentContact?: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "transferred";
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  grade: number;
}

// Timetable Types
export interface TimeSlot {
  id: string;
  period: number;
  startTime: string;
  endTime: string;
}

export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface TimetableEntry {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  day: Day;
  timeSlotId: string;
  room?: string;
  academicYear: string;
  semester: number;
}

// Record Book Types
export interface RecordBookEntry {
  id: string;
  date: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  period: number;
  lessonContent: string;
  teachingMethod?: string;
  studentAttitude?: string;
  absentStudentIds: string[];
  lateStudentIds: string[];
  violationNotes?: string;
  homeworkAssigned?: string;
  otherNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomeroomNote {
  id: string;
  classId: string;
  teacherId: string;
  date: string;
  type: "daily_reminder" | "weekly_summary" | "announcement" | "discipline";
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

// Statistics Types
export interface ClassStatistics {
  classId: string;
  className: string;
  totalStudents: number;
  averageAttendance: number;
  disciplinaryIssues: number;
  completedLessons: number;
  totalLessons: number;
}

export interface TeacherStatistics {
  teacherId: string;
  teacherName: string;
  totalClasses: number;
  totalLessons: number;
  completedEntries: number;
  pendingEntries: number;
  homeroomClass?: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  period?: number;
  subjectId?: string;
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}
