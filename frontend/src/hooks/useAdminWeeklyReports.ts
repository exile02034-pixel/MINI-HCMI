import { reportService } from "../services/api/reportService";
import { useAsyncData } from "./useAsyncData";

export const useAdminWeeklyReports = (weekStart?: string) =>
  useAsyncData(() => reportService.getWeekly(weekStart), [weekStart]);
