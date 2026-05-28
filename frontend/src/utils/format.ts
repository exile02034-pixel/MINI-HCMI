import { AttendanceComputed } from "../types";

export const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatTimeOnly = (value?: string | null) => {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatHours = (value?: number | null) => `${(value || 0).toFixed(2)}h`;

export const formatMinutes = (value?: number | null) => `${value || 0} min`;

export const emptyMetrics = (): AttendanceComputed => ({
  totalHours: 0,
  regularHours: 0,
  overtimeHours: 0,
  nightDiffHours: 0,
  lateMinutes: 0,
  undertimeMinutes: 0,
});

export const toTimeInput = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
};
