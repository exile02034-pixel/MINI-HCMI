import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./useRegister";
import { ApiError } from "../types";

export function useRegisterForm() {
  const register = useRegister();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      await register({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        password,
        role: "employee",
        timezone: String(formData.get("timezone") || "Asia/Manila"),
        schedule: {
          start: String(formData.get("scheduleStart") || "09:00"),
          end: String(formData.get("scheduleEnd") || "18:00"),
        },
      });

      setMessage("Registration successful. You can now log in.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    error,
    message,
    isSubmitting,
    onSubmit,
  };
}
