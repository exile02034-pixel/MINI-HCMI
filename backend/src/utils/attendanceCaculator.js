import { combineDateAndTime, getLocalDateString } from "./dateTimeHelper.js";

const MS_PER_MINUTE = 1000 * 60;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const calculateAttendance = ({ timeIn, timeOut, schedule, timeZone = "Asia/Manila" }) => {
  const start = new Date(timeIn);
  const end = new Date(timeOut);

  const localWorkDate = getLocalDateString(start, timeZone);
  const shiftStart = combineDateAndTime(localWorkDate, schedule.start, timeZone);
  let shiftEnd = combineDateAndTime(localWorkDate, schedule.end, timeZone);

  if (shiftEnd <= shiftStart) {
    shiftEnd = new Date(shiftEnd.getTime() + MS_PER_DAY);
  }

  const adjustedEnd = end < start ? new Date(start) : end;
  const totalMinutes = Math.max(0, (adjustedEnd - start) / MS_PER_MINUTE);

  const lateMinutes =
    start > shiftStart ? (start - shiftStart) / MS_PER_MINUTE : 0;

  const undertimeMinutes =
    adjustedEnd < shiftEnd ? (shiftEnd - adjustedEnd) / MS_PER_MINUTE : 0;

  const overtimeMinutes =
    adjustedEnd > shiftEnd ? (adjustedEnd - shiftEnd) / MS_PER_MINUTE : 0;

  const regularEnd = adjustedEnd > shiftEnd ? shiftEnd : adjustedEnd;
  const regularStart = start < shiftStart ? shiftStart : start;

  const regularMinutes =
    regularEnd > regularStart
      ? (regularEnd - regularStart) / MS_PER_MINUTE
      : 0;

  const nightDiffMinutes = calculateNightDiffMinutes(start, adjustedEnd, timeZone);

  return {
    totalHours: toHours(totalMinutes),
    regularHours: toHours(regularMinutes),
    overtimeHours: toHours(overtimeMinutes),
    nightDiffHours: toHours(nightDiffMinutes),
    lateMinutes: Math.round(lateMinutes),
    undertimeMinutes: Math.round(undertimeMinutes),
  };
};

const calculateNightDiffMinutes = (start, end, timeZone) => {
  let minutes = 0;
  const current = new Date(start);

  while (current < end) {
    const hour = Number(
      new Intl.DateTimeFormat("en-CA", {
        timeZone,
        hour: "2-digit",
        hourCycle: "h23",
      }).format(current)
    );

    if (hour >= 22 || hour < 6) {
      minutes++;
    }

    current.setMinutes(current.getMinutes() + 1);
  }

  return minutes;
};

const toHours = (minutes) => {
  return Number((minutes / 60).toFixed(2));
};
