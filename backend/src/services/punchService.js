import { AppError } from "../errors/AppError.js";
import { attendanceRepository } from "../repositories/attendanceRepository.js";
import { dailySummaryRepository } from "../repositories/dailySummaryRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { calculateAttendance } from "../utils/attendanceCaculator.js";
import { combineDateAndTime, getLocalDateString } from "../utils/dateTimeHelper.js";
import { serializeAttendanceRecord } from "../utils/serialization.js";

const getTodayDate = (timeZone = "Asia/Manila") => getLocalDateString(new Date(), timeZone);

const buildEmployeeSnapshot = (user) => ({
  uid: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  timezone: user.timezone,
  schedule: user.schedule,
});

const toMinutes = (time) => {
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const isOvernightSchedule = (schedule) => toMinutes(schedule.end) <= toMinutes(schedule.start);

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
};

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

const removeDailySummary = async ({ userId, date }) => {
  const summaryId = `${userId}_${date}`;
  await dailySummaryRepository.remove(summaryId);
};

const getRequiredUser = async (userId) => {
  const user = await userRepository.getById(userId);
  if (!user) {
    throw new AppError("User profile not found", 404);
  }
  return user;
};

const DATE_TIME_LOCAL_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

const TIME_ONLY_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

const parseDateTimeLocalValue = (value, timeZone) => {
  const match = value.match(DATE_TIME_LOCAL_PATTERN);

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute, second = "0"] = match;

  return combineDateAndTime(
    `${year}-${month}-${day}`,
    `${hour}:${minute}:${second}`,
    timeZone
  );
};

const parseEditedDateTime = (value, date, timeZone) => {
  if (!value) return null;

  let parsedDate = null;

  if (DATE_TIME_LOCAL_PATTERN.test(value)) {
    parsedDate = parseDateTimeLocalValue(value, timeZone);
  } else if (TIME_ONLY_PATTERN.test(value)) {
    parsedDate = combineDateAndTime(date, value, timeZone);
  } else {
    parsedDate = new Date(value);
  }

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    throw new AppError("Invalid date/time value provided.", 400);
  }

  return parsedDate;
};

const resolveEditedTimeOut = ({
  value,
  attendanceDate,
  timeZone,
  updatedTimeIn,
  schedule,
}) => {
  if (!value) return null;

  let parsedTimeOut = parseEditedDateTime(value, attendanceDate, timeZone);

  if (parsedTimeOut < updatedTimeIn && isOvernightSchedule(schedule)) {
    parsedTimeOut = addDays(parsedTimeOut, 1);
  }

  return parsedTimeOut;
};

const getLatestOpenAttendance = async (userId) => {
  const recentRecords = await attendanceRepository.listByUser(userId, 30);
  return recentRecords.find((record) => record.status === "open" || !record.timeOut) || null;
};

export const punchService = {
  async punchIn(userId) {
    const user = await getRequiredUser(userId);
    const timeIn = new Date();
    const date = getTodayDate(user.timezone);

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
    const user = await getRequiredUser(userId);
    const timeOut = new Date();
    const date = getTodayDate(user.timezone);
    const attendance =
      (await attendanceRepository.getById(`${userId}_${date}`)) ||
      (await getLatestOpenAttendance(userId));
    if (!attendance) {
      throw new AppError("No punch in record found for today", 400);
    }

    if (attendance.timeOut) {
      throw new AppError("You already punched out today", 400);
    }

    const attendanceId = attendance.id;

    const result = calculateAttendance({
      timeIn: attendance.timeIn.toDate(),
      timeOut,
      schedule: user.schedule,
      timeZone: user.timezone,
    });

    await attendanceRepository.update(attendanceId, {
      timeOut,
      status: "completed",
      computed: result,
    });

    await saveDailySummary({ userId, date: attendance.date, attendanceId, result });

    return {
      message: "Punched out successfully",
      summary: result,
    };
  },

  async getPunchRecord(userId, date) {
    const user = await getRequiredUser(userId);
    const resolvedDate = date || getTodayDate(user.timezone);
    const attendanceId = `${userId}_${resolvedDate}`;
    const attendance =
      (await attendanceRepository.getById(attendanceId)) ||
      (!date ? await getLatestOpenAttendance(userId) : null);

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
      ? parseEditedDateTime(timeIn, attendance.date, user.timezone)
      : attendance.timeIn.toDate();

    const updatedTimeOut = timeOut
      ? resolveEditedTimeOut({
          value: timeOut,
          attendanceDate: attendance.date,
          timeZone: user.timezone,
          updatedTimeIn,
          schedule: user.schedule,
        })
      : attendance.timeOut?.toDate() || null;

    if (updatedTimeOut && updatedTimeOut < updatedTimeIn) {
      throw new AppError("Time out cannot be earlier than time in.", 400);
    }

    let computed = null;
    const status = updatedTimeOut ? "completed" : "open";

    if (updatedTimeOut) {
      computed = calculateAttendance({
        timeIn: updatedTimeIn,
        timeOut: updatedTimeOut,
        schedule: user.schedule,
        timeZone: user.timezone,
      });
    }

    await attendanceRepository.update(attendanceId, {
      timeIn: updatedTimeIn,
      timeOut: updatedTimeOut,
      status,
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
    } else {
      await removeDailySummary({
        userId: attendance.userId,
        date: attendance.date,
      });
    }

    const refreshedAttendance = await attendanceRepository.getById(attendanceId);

    return {
      message: "Attendance record updated successfully",
      computed,
      attendance: serializeAttendanceRecord(attendanceId, refreshedAttendance, {
        employee: buildEmployeeSnapshot(user),
      }),
    };
  },
};
