export const calculateAttendance = ({ timeIn, timeOut, schedule }) => {
  const start = new Date(timeIn);
  const end = new Date(timeOut);

  const year = start.getFullYear();
  const month = start.getMonth();
  const day = start.getDate();

  const [startHour, startMinute] = schedule.start.split(":").map(Number);
  const [endHour, endMinute] = schedule.end.split(":").map(Number);

  const shiftStart = new Date(year, month, day, startHour, startMinute, 0);
  const shiftEnd = new Date(year, month, day, endHour, endMinute, 0);

  const totalMinutes = Math.max(0, (end - start) / (1000 * 60));

  const lateMinutes =
    start > shiftStart ? (start - shiftStart) / (1000 * 60) : 0;

  const undertimeMinutes =
    end < shiftEnd ? (shiftEnd - end) / (1000 * 60) : 0;

  const overtimeMinutes =
    end > shiftEnd ? (end - shiftEnd) / (1000 * 60) : 0;

  const regularEnd = end > shiftEnd ? shiftEnd : end;
  const regularStart = start < shiftStart ? shiftStart : start;

  const regularMinutes =
    regularEnd > regularStart
      ? (regularEnd - regularStart) / (1000 * 60)
      : 0;

  const nightDiffMinutes = calculateNightDiffMinutes(start, end);

  return {
    totalHours: toHours(totalMinutes),
    regularHours: toHours(regularMinutes),
    overtimeHours: toHours(overtimeMinutes),
    nightDiffHours: toHours(nightDiffMinutes),
    lateMinutes: Math.round(lateMinutes),
    undertimeMinutes: Math.round(undertimeMinutes),
  };
};

const calculateNightDiffMinutes = (start, end) => {
  let minutes = 0;
  const current = new Date(start);

  while (current < end) {
    const hour = current.getHours();

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