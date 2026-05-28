import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "./useLogin";
import { ApiError } from "../types";

export function useLoginForm() {
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      await login({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
      });

      const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";
      navigate(nextPath);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    error,
    isSubmitting,
    onSubmit,
  };
}
