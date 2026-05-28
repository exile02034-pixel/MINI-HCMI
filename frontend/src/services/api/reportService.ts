import { DailySummary, WeeklySummary } from "../../types";
import { apiRequest } from "./client";

export const reportService = {
  getDaily: (date?: string) =>
    apiRequest<DailySummary[]>(`/reports/daily${date ? `?date=${date}` : ""}`),
  getWeekly: (weekStart?: string) =>
    apiRequest<WeeklySummary[]>(`/reports/weekly${weekStart ? `?weekStart=${weekStart}` : ""}`),
};
