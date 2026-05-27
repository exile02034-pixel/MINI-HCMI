import { db } from "../config/firebaseConfig.js";

export const saveDailySummary = async ({
  userId,
  date,
  attendanceId,
  result,
}) => {
  const summaryId = `${userId}_${date}`;

  await db.collection("dailySummary").doc(summaryId).set(
    {
      userId,
      date,
      attendanceId,
      status: "completed",

      totalHours: result.totalHours,
      regularHours: result.regularHours,
      overtimeHours: result.overtimeHours,
      nightDiffHours: result.nightDiffHours,
      lateMinutes: result.lateMinutes,
      undertimeMinutes: result.undertimeMinutes,

      updatedAt: new Date(),
    },
    { merge: true }
  );
};