const getFormatterParts = (date, timeZone) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
};

const pad = (value) => `${value}`.padStart(2, "0");

const getTimeZoneOffset = (date, timeZone) => {
  const parts = getFormatterParts(date, timeZone);

  const asUtcTimestamp = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return asUtcTimestamp - date.getTime();
};

export const getLocalDateParts = (date, timeZone = "Asia/Manila") => {
  const parts = getFormatterParts(date, timeZone);

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
};

export const getLocalDateString = (date, timeZone = "Asia/Manila") => {
  const parts = getLocalDateParts(date, timeZone);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
};

export const combineDateAndTime = (date, time, timeZone = "Asia/Manila") => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second = 0] = time.split(":").map(Number);

  const baseUtcTimestamp = Date.UTC(year, month - 1, day, hour, minute, second);
  let combined = new Date(baseUtcTimestamp);

  // Run twice to stabilize the result for DST-aware time zones.
  for (let iteration = 0; iteration < 2; iteration += 1) {
    const offset = getTimeZoneOffset(combined, timeZone);
    combined = new Date(baseUtcTimestamp - offset);
  }

  return combined;
};
