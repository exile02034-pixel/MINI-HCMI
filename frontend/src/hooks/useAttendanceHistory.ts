import { attendanceService } from "../services/api/attendanceService";
import { useAsyncData } from "./useAsyncData";

export function useAttendanceHistory(limit = 10) {
  return useAsyncData(() => attendanceService.getMyHistory(limit), [limit]);
}
