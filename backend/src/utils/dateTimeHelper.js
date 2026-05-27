export const combineDateAndTime = (date, time) => {
  const [hour, minute] = time.split(":").map(Number);

  const combined = new Date(`${date}T00:00:00`);

  combined.setHours(hour, minute, 0, 0);

  return combined;
};