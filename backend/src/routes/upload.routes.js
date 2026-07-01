import express from 'express'
import { uploadImageHandler, uploadAvatar, deleteImageHandler } from '../controllers/upload.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'
import upload from '../middleware/upload.middleware.js'

const router = express.Router()

router.post  ('/image',              authMiddleware, adminMiddleware, upload.single('image'), uploadImageHandler)
router.post  ('/avatar',             authMiddleware, upload.single('image'), uploadAvatar)
router.delete('/image/:publicId',    authMiddleware, adminMiddleware, deleteImageHandler)

export default router
