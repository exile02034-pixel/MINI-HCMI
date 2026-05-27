import express from 'express'
import {punchIn, punchOut, getPunchRecord, getAllPunchRecords, editPunchRecord} from '../controller/punchController.js'
import authmiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
const punchRouter = express.Router()
punchRouter.get("/", authmiddleware, adminMiddleware, getAllPunchRecords);

punchRouter.post("/in", authmiddleware, punchIn);

punchRouter.post("/out", authmiddleware, punchOut);

punchRouter.put("/edit/:attendanceId", authmiddleware,adminMiddleware, editPunchRecord
);

// ALWAYS PLACE DYNAMIC ROUTES LAST
punchRouter.post("/:userId", authmiddleware, getPunchRecord);
export default punchRouter