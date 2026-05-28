import { AppError } from "../errors/AppError.js";
import { attendanceRepository } from "../repositories/attendanceRepository.js";
import { dailySummaryRepository } from "../repositories/dailySummaryRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { calculateAttendance } from "../utils/attendanceCaculator.js";
import { combineDateAndTime } from "../utils/dateTimeHelper.js";
import { serializeAttendanceRecord } from "../utils/serialization.js";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const buildEmployeeSnapshot = (user) => ({
  uid: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  timezone: user.timezone,
  schedule: user.schedule,
});

const saveDailySummary = async ({ userId, date, attendanceId, result }) => {
  const summaryId = `${userId}_${date}`;

  await dailySummaryRepository.save(summaryId, {
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
  });
};

const getRequiredUser = async (userId) => {
  const user = await userRepository.getById(userId);
  if (!user) {
    throw new AppError("User profile not found", 404);
  }
  return user;
};

export const punchService = {
  async punchIn(userId) {
    const timeIn = new Date();
    const date = getTodayDate();

    const existingAttendance = await attendanceRepository.findByUserAndDate(userId, date);
    if (existingAttendance) {
      throw new AppError("You already punched in today", 400);
    }

    const attendanceId = `${userId}_${date}`;

    await attendanceRepository.create(attendanceId, {
      userId,
      date,
      timeIn,
      timeOut: null,
      status: "open",
      createdAt: new Date(),
    });

    return { message: "Punched in successfully" };
  },

  async punchOut(userId) {
    const timeOut = new Date();
    const date = getTodayDate();
    const attendanceId = `${userId}_${date}`;

    const attendance = await attendanceRepository.getById(attendanceId);
    if (!attendance) {
      throw new AppError("No punch in record found for today", 400);
    }

    if (attendance.timeOut) {
      throw new AppError("You already punched out today", 400);
    }

    const user = await getRequiredUser(userId);

    const result = calculateAttendance({
      timeIn: attendance.timeIn.toDate(),
      timeOut,
      schedule: user.schedule,
    });

    await attendanceRepository.update(attendanceId, {
      timeOut,
      status: "completed",
      computed: result,
    });

    await saveDailySummary({ userId, date, attendanceId, result });

    return {
      message: "Punched out successfully",
      summary: result,
    };
  },

  async getPunchRecord(userId, date = getTodayDate()) {
    const attendanceId = `${userId}_${date}`;
    const attendance = await attendanceRepository.getById(attendanceId);

    if (!attendance) {
      throw new AppError("Attendance record not found", 404);
    }

    return serializeAttendanceRecord(attendance.id, attendance);
  },

  async getAllPunchRecords() {
    const records = await attendanceRepository.listAll(500);

    return Promise.all(
      records.map(async (record) => {
        const user = await userRepository.getById(record.userId);

        return serializeAttendanceRecord(record.id, record, {
          employee: user ? buildEmployeeSnapshot(user) : null,
        });
      })
    );
  },

  async editPunchRecord({ attendanceId, timeIn, timeOut, editedBy }) {
    const attendance = await attendanceRepository.getById(attendanceId);

    if (!attendance) {
      throw new AppError("Attendance record not found", 404);
    }

    const user = await getRequiredUser(attendance.userId);

    const updatedTimeIn = timeIn
      ? combineDateAndTime(attendance.date, timeIn)
      : attendance.timeIn.toDate();

    const updatedTimeOut = timeOut
      ? combineDateAndTime(attendance.date, timeOut)
      : attendance.timeOut?.toDate() || null;

    let computed = null;

    if (updatedTimeOut) {
      computed = calculateAttendance({
        timeIn: updatedTimeIn,
        timeOut: updatedTimeOut,
        schedule: user.schedule,
      });
    }

    await attendanceRepository.update(attendanceId, {
      timeIn: updatedTimeIn,
      timeOut: updatedTimeOut,
      computed,
      updatedAt: new Date(),
      editedBy,
    });

    if (computed) {
      await saveDailySummary({
        userId: attendance.userId,
        date: attendance.date,
        attendanceId,
        result: computed,
      });
    }

    return {
      message: "Attendance record updated successfully",
      computed,
    };
  },
};
