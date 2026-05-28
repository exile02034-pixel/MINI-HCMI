import { punchService } from "../services/api/punchService";
import { useAsyncData } from "./useAsyncData";

export const useAdminPunches = () => useAsyncData(() => punchService.getAll(), []);
