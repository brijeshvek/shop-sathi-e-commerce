import express from 'express'
import { register, login, logout, getMe, forgotPassword, resetPassword } from '../controllers/auth.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register',       register)
router.post('/login',          login)
router.post('/logout',         authMiddleware, logout)
router.get ('/me',             authMiddleware, getMe)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password',  resetPassword)

export default router
