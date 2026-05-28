import { AppError } from "../errors/AppError.js";
import { punchService } from "../services/punchService.js";

export const punchIn = async (req, res) => {
  try {
    const result = await punchService.punchIn(req.userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      message: error.message || "Failed to punch in",
      error: error.details || error.message,
    });
  }
};

export const punchOut = async (req, res) => {
  try {
    const result = await punchService.punchOut(req.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      message: error.message || "Failed to punch out",
      error: error.details || error.message,
    });
  }
};

export const getPunchRecord = async (req, res) => {
  try {
    const record = await punchService.getPunchRecord(req.userId, req.query.date);
    res.status(200).json(record);
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      message: error.message || "Failed to get punch record",
      error: error.details || error.message,
    });
  }
};

export const getAllPunchRecords = async (req, res) => {
  try {
    const attendanceRecords = await punchService.getAllPunchRecords();
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      message: error.message || "Failed to get punch records",
      error: error.details || error.message,
    });
  }
};

export const editPunchRecord = async (req, res) => {
  try {
    const result = await punchService.editPunchRecord({
      attendanceId: req.params.attendanceId,
      timeIn: req.body.timeIn,
      timeOut: req.body.timeOut,
      editedBy: req.userId,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      message: error.message || "Failed to update attendance record",
      error: error.details || error.message,
    });
  }
};
