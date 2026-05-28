import express from 'express'
import {db} from './config/firebaseConfig.js'
import authRouter from './routes/authRoutes.js'
import punchRouter from './routes/punchRoutes.js'
import attendanceRouter from './routes/attendanceRoutes.js'
import reportRouter from './routes/reportRoutes.js'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config()
const app = express()
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
const PORT = process.env.PORT || 5000
app.use(express.json());

app.use('/api/auth', authRouter)
app.use('/api/punch', punchRouter)
app.use('/api/attendance', attendanceRouter);
app.use('/api/reports', reportRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
