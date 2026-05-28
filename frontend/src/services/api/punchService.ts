import { AttendanceRecord } from "../../types";
import { apiRequest } from "./client";

export const punchService = {
  getToday: (date?: string) =>
    apiRequest<AttendanceRecord>(`/punch${date ? `?date=${date}` : ""}`),
  punchIn: () =>
    apiRequest<{ message: string }>("/punch/in", {
      method: "POST",
    }),
  punchOut: () =>
    apiRequest<{ message: string; summary: AttendanceRecord["computed"] }>("/punch/out", {
      method: "POST",
    }),
  getAll: () => apiRequest<AttendanceRecord[]>("/punch/all"),
  edit: (attendanceId: string, payload: { timeIn?: string; timeOut?: string }) =>
    apiRequest<{ message: string; attendance: AttendanceRecord }>("/punch/edit/" + attendanceId, {
      method: "PUT",
      body: payload,
    }),
};
