import { serializeAttendanceRecord } from "./serialization.js";

export const formatAttendance = (doc) => {
  const data = doc.data();

  return serializeAttendanceRecord(doc.id, data);
};
