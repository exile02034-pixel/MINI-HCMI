import { db } from "../config/firebaseConfig.js";
import { calculateAttendance } from "../utils/attendanceCaculator.js";
import {combineDateAndTime} from "../utils/dateTimeHelper.js"
import {saveDailySummary} from "../utils/saveDailySummary.js";  
export const punchIn = async (req, res) => {
  try {
    const userId = req.userId;
    const timeIn = new Date();
    const date = timeIn.toISOString().split("T")[0];

    const existingAttendanceSnapshot = await db
      .collection("attendance")
      .where("userId", "==", userId)
      .where("date", "==", date)
      .limit(1)
      .get();

    if (!existingAttendanceSnapshot.empty) {
      return res.status(400).json({
        message: "You already punched in today",
      });
    }

    const attendanceId = `${userId}_${date}`;

    await db.collection("attendance").doc(attendanceId).set({
      userId,
      date,
      timeIn,
      timeOut: null,
      status: "open",
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Punched in successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to punch in",
      error: error.message,
    });
  }
};

export const punchOut = async (req, res) => {
  try {
    const userId = req.userId;
    const timeOut = new Date();
    const date = timeOut.toISOString().split("T")[0];

    const attendanceId = `${userId}_${date}`;
    const attendanceRef = db.collection("attendance").doc(attendanceId);

    const attendanceDoc = await attendanceRef.get();

    if (!attendanceDoc.exists) {
      return res.status(400).json({
        message: "No punch in record found for today",
      });
    }

    const attendanceData = attendanceDoc.data();

    if (attendanceData.timeOut) {
      return res.status(400).json({
        message: "You already punched out today",
      });
    }

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    const userData = userDoc.data();

    const result = calculateAttendance({
      timeIn: attendanceData.timeIn.toDate(),
      timeOut,
      schedule: userData.schedule,
    });

    await attendanceRef.update({
      timeOut,
      status: "completed",
      computed: result,
    });

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

    res.status(200).json({
      message: "Punched out successfully",
      summary: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to punch out",
      error: error.message,
    });
  }
};

export const editPunch = async (req, res) => {
  try {
    const userId = req.userId;
    const { date, timeIn, timeOut } = req.body;
    const attendanceId = `${userId}_${date}`;
    const attendanceRef = db.collection("attendance").doc(attendanceId);
    const attendanceDoc = await attendanceRef.get();

    if (!attendanceDoc.exists) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }
    const attendanceData = attendanceDoc.data();

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        message: "User profile not found",
      });
    } 
    const userData = userDoc.data();

    const result = calculateAttendance({
      timeIn: timeIn ? new Date(timeIn) : attendanceData.timeIn.toDate(),
      timeOut: timeOut ? new Date(timeOut) : attendanceData.timeOut?.toDate(),
      schedule: userData.schedule,
    });
    await attendanceRef.update({
      timeIn: timeIn ? new Date(timeIn) : attendanceData.timeIn.toDate(),
      timeOut: timeOut ? new Date(timeOut) : attendanceData.timeOut?.toDate(),
      computed: result,
      updatedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to edit punch",
      error: error.message,
    });
  } 
} 

export const getPunchRecord = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;
    const attendanceId = `${userId}_${date}`;
    const attendanceDoc = await db.collection("attendance").doc(attendanceId).get();
    if (!attendanceDoc.exists) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }
    const attendanceData = attendanceDoc.data();
    res.status(200).json({
      id: attendanceDoc.id,
      userId: attendanceData.userId,
      date: attendanceData.date,
      timeIn: attendanceData.timeIn,
      timeOut: attendanceData.timeOut,  
      status: attendanceData.status,
      computed: attendanceData.computed || null,
      createdAt: attendanceData.createdAt.toDate().toISOString(),
      updatedAt: attendanceData.updatedAt ? attendanceData.updatedAt.toDate().toISOString() : null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get punch record",
      error: error.message,
    });
  } 
};

export const getAllPunchRecords = async (req, res) => {
  try {
    const attendanceSnapshot = await db.collection("attendance").orderBy("createdAt", "desc").get();
    const attendanceRecords = attendanceSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        date: data.date,
        timeIn: data.timeIn,
        timeOut: data.timeOut,
        status: data.status,
        computed: data.computed || null,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
      };
    });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get punch records",
      error: error.message,
    });
  }
};

export const editPunchRecord = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { timeIn, timeOut } = req.body;

    const attendanceRef = db
      .collection("attendance")
      .doc(attendanceId);

    const attendanceDoc = await attendanceRef.get();

    if (!attendanceDoc.exists) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    const attendanceData = attendanceDoc.data();

    const userDoc = await db
      .collection("users")
      .doc(attendanceData.userId)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    const userData = userDoc.data();

    const updatedTimeIn = timeIn
    ? combineDateAndTime(attendanceData.date, timeIn)
    : attendanceData.timeIn.toDate();

  const updatedTimeOut = timeOut
    ? combineDateAndTime(attendanceData.date, timeOut)
    : attendanceData.timeOut?.toDate() || null;

    let computed = null;

    if (updatedTimeOut) {
      computed = calculateAttendance({
        timeIn: updatedTimeIn,
        timeOut: updatedTimeOut,
        schedule: userData.schedule,
      });
    }

    await attendanceRef.update({
      timeIn: updatedTimeIn,
      timeOut: updatedTimeOut,
      computed,
      updatedAt: new Date(),
      editedBy: req.userId,
    });

    res.status(200).json({
      message: "Attendance record updated successfully",
      computed,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update attendance record",
      error: error.message,
    });
  }
};