import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { getDailyReports, getWeeklyReports } from "../controller/reportController.js";

const reportRouter = express.Router();

reportRouter.get("/daily", authMiddleware, adminMiddleware, getDailyReports);
reportRouter.get("/weekly", authMiddleware, adminMiddleware, getWeeklyReports);

export default reportRouter;
