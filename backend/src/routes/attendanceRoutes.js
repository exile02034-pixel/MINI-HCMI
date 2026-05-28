import {getUserAttendance, getAllAttendance} from '../controller/attendanceController.js'
import express from 'express'
import authmiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
const attendanceRouter = express.Router()

attendanceRouter.get('/all', authmiddleware, adminMiddleware, getAllAttendance)
attendanceRouter.get('/me', authmiddleware, getUserAttendance)


export default attendanceRouter
