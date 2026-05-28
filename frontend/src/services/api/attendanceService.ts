import { AttendanceRecord } from "../../types";
import { apiRequest } from "./client";

export const attendanceService = {
  getMyHistory: (limit = 10) => apiRequest<AttendanceRecord[]>(`/attendance/me?limit=${limit}`),
  getAll: (limit = 50) => apiRequest<AttendanceRecord[]>(`/attendance/all?limit=${limit}`),
};
