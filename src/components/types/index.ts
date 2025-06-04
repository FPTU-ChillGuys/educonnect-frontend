// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type UserRole = "admin" | "teacher" | "parent";

// School Structure Types
export interface Class {
  id: string;
  name: string;
  classTeacherId: string;
  grade: number;
  academicYear: string;
  students: Student[];
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  parentIds: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Teacher {
  id: string;
  userId: string;
  name: string;
  subjects: Subject[];
  classId?: string; // ID of the class they are homeroom teacher for, if any
}

export interface Parent {
  id: string;
  userId: string;
  name: string;
  studentIds: string[];
}

// Timetable Types
export interface TimeSlot {
  id: string;
  day: Day;
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
  | "saturday"
  | "sunday";

export interface TimetableEntry {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  timeSlotId: string;
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
  studentAttitude?: string;
  absentStudentIds: string[];
  violationNotes?: string;
  otherNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassTeacherNote {
  id: string;
  classId: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Communication Types
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isAI: boolean;
  forwardedToTeacher: boolean;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  read: boolean;
  type: "daily" | "weekly" | "urgent" | "general";
}

// AI Response Types
export interface AIResponse {
  content: string;
  confidence: number;
  sourcesUsed: string[];
  needsHumanAttention: boolean;
}
