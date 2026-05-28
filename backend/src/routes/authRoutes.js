import express from 'express'
import {registerUser,loginUser,getCurrentUser,logoutUser} from '../controller/authController.js'
import authmiddleware from '../middleware/authMiddleware.js'
const authRouter = express.Router() 

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.get('/me', authmiddleware, getCurrentUser)
authRouter.post('/logout', authmiddleware, logoutUser)


export default authRouter

