import express from 'express'
import { getSettings, updateSettings } from '../controllers/setting.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = express.Router()

router.route('/')
  .get(getSettings)
  .put(authMiddleware, adminMiddleware, updateSettings)

export default router
