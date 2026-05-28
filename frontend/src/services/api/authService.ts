import { AuthResponse, LoginPayload, RegisterPayload, SessionResponse } from "../../types";
import { apiRequest } from "./client";

export const authService = {
  register: (payload: RegisterPayload) =>
    apiRequest<{ message: string; uid: string }>("/auth/register", {
      method: "POST",
      body: payload,
    }),
  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    }),
  me: () => apiRequest<SessionResponse>("/auth/me"),
  logout: () =>
    apiRequest<{ message: string }>("/auth/logout", {
      method: "POST",
    }),
};
