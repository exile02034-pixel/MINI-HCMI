import { useState } from "react";
import { ApiError } from "../types";
import { punchService } from "../services/api/punchService";

export function usePunchActions(onSuccess?: () => Promise<void> | void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const run = async (action: () => Promise<{ message: string }>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await action();
      setMessage(response.message);
      await onSuccess?.();
    } catch (err) {
      setError(err as ApiError);
      setMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    message,
    punchIn: () => run(() => punchService.punchIn()),
    punchOut: () => run(() => punchService.punchOut()),
  };
}
