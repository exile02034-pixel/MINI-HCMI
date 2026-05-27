export const formatAttendance = (doc) => {
  const data = doc.data();

  return {
    id: doc.id,
    userId: data.userId,
    date: data.date,
    status: data.status,

    punchInTime: formatTime(data.punchInTime),
    punchOutTime: formatTime(data.punchOutTime),

    createdAt: data.createdAt
      ? data.createdAt.toDate().toISOString()
      : null,

    computed: data.computed || null,
  };
};

const formatTime = (timestamp) => {
  if (!timestamp) return null;

  return timestamp.toDate().toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};