import express from 'express'
import {db} from './config/firebaseConfig.js'
import authRouter from './routes/authRoutes.js'
import punchRouter from './routes/punchRoutes.js'
import attendanceRouter from './routes/attendanceRoutes.js'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";


dotenv.config()
const app = express()
app.use(cookieParser());
const PORT = process.env.PORT || 5000
app.use(express.json());

app.use('/api/auth', authRouter)
app.use('/api/punch', punchRouter)
app.use('/api/attendance', attendanceRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})