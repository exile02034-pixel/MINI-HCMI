import { db } from "../config/firebaseConfig.js";
import { formatAttendance } from "../utils/attendanceFormatter.js";
export const getUserAttendance = async (req, res) => {
  try {
    const userId = req.userId;

    const attendanceSnapshot = await db
      .collection("attendance")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const attendanceRecords = attendanceSnapshot.docs.map((doc) =>
      formatAttendance(doc)
    );

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching user attendance:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const attendanceSnapshot = await db
      .collection("attendance")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const attendanceRecords = await Promise.all(
      attendanceSnapshot.docs.map(async (doc) => {
        const formattedAttendance = formatAttendance(doc);

        // Fetch user profile
        const userDoc = await db
          .collection("users")
          .doc(formattedAttendance.userId)
          .get();

        const userData = userDoc.exists ? userDoc.data() : null;

        return {
          ...formattedAttendance,
          employee: userData
            ? {
                name: userData.name,

              }
            : null,
        };
      })
    );

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};