import { reportService } from "../services/api/reportService";
import { useAsyncData } from "./useAsyncData";

export const useAdminDailyReports = (date?: string) =>
  useAsyncData(() => reportService.getDaily(date), [date]);
