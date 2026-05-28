import { AttendanceComputed } from "../types";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getFormatterParts = (value: string, timeZone?: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  ) as Record<string, string>;
};

export const formatDate = (value?: string | null) => {
  if (!value) return "N/A";

  if (DATE_ONLY_PATTERN.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)));
  }

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (value?: string | null, timeZone?: string) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
};

export const formatTimeOnly = (value?: string | null, timeZone?: string) => {
  if (!value) return "--:--";

  return new Date(value).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
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

export const toTimeInput = (value?: string | null, timeZone?: string) => {
  if (!value) return "";

  const parts = getFormatterParts(value, timeZone);

  if (!parts) return "";

  return `${parts.hour}:${parts.minute}`;
};

export const toDateTimeLocalInput = (value?: string | null, timeZone?: string) => {
  if (!value) return "";

  const parts = getFormatterParts(value, timeZone);

  if (!parts) return "";

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};
