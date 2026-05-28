import { AppError } from "../errors/AppError.js";
import { reportService } from "../services/reportService.js";

export const getDailyReports = async (req, res) => {
  try {
    const reports = await reportService.getDailyReports(req.query.date);
    res.status(200).json(reports);
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      message: error.message || "Failed to load daily reports",
      error: error.details || error.message,
    });
  }
};

export const getWeeklyReports = async (req, res) => {
  try {
    const reports = await reportService.getWeeklyReports(req.query.weekStart);
    res.status(200).json(reports);
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      message: error.message || "Failed to load weekly reports",
      error: error.details || error.message,
    });
  }
};
