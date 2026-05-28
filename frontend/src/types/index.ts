export type Role = "employee" | "admin";

export interface Schedule {
  start: string;
  end: string;
}

export interface User {
  uid?: string;
  name: string;
  email: string;
  role: Role;
  timezone: string;
  schedule: Schedule;
  createdAt?: string | null;
}

export interface AttendanceComputed {
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  nightDiffHours: number;
  lateMinutes: number;
  undertimeMinutes: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  status: string;
  computed: AttendanceComputed | null;
  createdAt: string | null;
  updatedAt: string | null;
  employee?: Pick<User, "name" | "email" | "role" | "timezone" | "schedule" | "uid"> | null;
}

export interface DailySummary {
  id: string;
  userId: string;
  date: string;
  attendanceId: string;
  status: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  nightDiffHours: number;
  lateMinutes: number;
  undertimeMinutes: number;
  updatedAt: string | null;
  employee: User | null;
}

export interface WeeklySummary {
  userId: string;
  weekStart: string;
  weekEnd: string;
  employee: User | null;
  totals: AttendanceComputed;
  dailyBreakdown: Omit<DailySummary, "id" | "employee" | "userId">[];
}

export interface SessionResponse {
  uid: string;
  user: User;
}

export interface AuthResponse extends SessionResponse {
  message: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  timezone: string;
  schedule: Schedule;
}

export interface LoginPayload {
  email: string;
  password: string;
}
