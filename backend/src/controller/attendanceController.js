import { AppError } from "../errors/AppError.js";
import { attendanceService } from "../services/attendanceService.js";

export const getUserAttendance = async (req, res) => {
  try {
    const attendanceRecords = await attendanceService.getUserAttendance(
      req.userId,
      Number(req.query.limit || 10)
    );
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: error.message || "Internal server error",
      details: error.details || null,
    });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await attendanceService.getAllAttendance(
      Number(req.query.limit || 50)
    );
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: error.message || "Internal server error",
      details: error.details || error.message,
    });
  }
};
