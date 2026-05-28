import express from 'express'
import authRouter from './routes/authRoutes.js'
import punchRouter from './routes/punchRoutes.js'
import attendanceRouter from './routes/attendanceRoutes.js'
import reportRouter from './routes/reportRoutes.js'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config()
const app = express()
app.set("trust proxy", 1);

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);
app.use(cookieParser());
const PORT = process.env.PORT || 5000
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRouter)
app.use('/api/punch', punchRouter)
app.use('/api/attendance', attendanceRouter);
app.use('/api/reports', reportRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
