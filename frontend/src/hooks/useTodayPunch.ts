import { useAsyncData } from "./useAsyncData";
import { punchService } from "../services/api/punchService";

export function useTodayPunch(date?: string) {
  return useAsyncData(
    async () => {
      try {
        return await punchService.getToday(date);
      } catch (error) {
        if ((error as { status?: number }).status === 404) {
          return null;
        }
        throw error;
      }
    },
    [date]
  );
}
