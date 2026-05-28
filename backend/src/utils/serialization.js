export const serializeTimestamp = (timestamp) => {
  if (!timestamp) return null;

  if (typeof timestamp?.toDate === "function") {
    return timestamp.toDate().toISOString();
  }

  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }

  return new Date(timestamp).toISOString();
};

export const serializeAttendanceRecord = (id, data, extras = {}) => ({
  id,
  userId: data.userId,
  date: data.date,
  timeIn: serializeTimestamp(data.timeIn),
  timeOut: serializeTimestamp(data.timeOut),
  status: data.status,
  computed: data.computed || null,
  createdAt: serializeTimestamp(data.createdAt),
  updatedAt: serializeTimestamp(data.updatedAt),
  ...extras,
});
