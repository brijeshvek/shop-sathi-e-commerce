import express from 'express'
import { uploadImageHandler, uploadAvatar, deleteImageHandler } from '../controllers/upload.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/role.middleware.js'
import upload from '../middleware/upload.middleware.js'

const router = express.Router()

router.post  ('/image',              authMiddleware, authorize('seller', 'admin', 'superadmin'), upload.single('image'), uploadImageHandler)
router.post  ('/avatar',             authMiddleware, upload.single('image'), uploadAvatar)
router.delete('/image/:publicId',    authMiddleware, authorize('seller', 'admin', 'superadmin'), deleteImageHandler)

export default router
