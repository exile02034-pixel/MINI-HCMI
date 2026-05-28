import { AppError } from "../errors/AppError.js";
import { attendanceRepository } from "../repositories/attendanceRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { formatAttendance } from "../utils/attendanceFormatter.js";

const toFormattedAttendance = (record) =>
  formatAttendance({
    id: record.id,
    data: () => record,
  });

export const attendanceService = {
  async getUserAttendance(userId, limit = 10) {
    try {
      const records = await attendanceRepository.listByUser(userId, limit);
      return records.map(toFormattedAttendance);
    } catch (error) {
      throw new AppError("Internal server error", 500, error.message);
    }
  },

  async getAllAttendance(limit = 50) {
    try {
      const records = await attendanceRepository.listAll(limit);

      return Promise.all(
        records.map(async (record) => {
          const user = await userRepository.getById(record.userId);

          return {
            ...toFormattedAttendance(record),
            employee: user
              ? {
                  uid: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  timezone: user.timezone,
                  schedule: user.schedule,
                }
              : null,
          };
        })
      );
    } catch (error) {
      throw new AppError("Internal server error", 500, error.message);
    }
  },
};
