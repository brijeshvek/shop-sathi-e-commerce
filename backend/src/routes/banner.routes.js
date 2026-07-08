import express from 'express'
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/banner.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = express.Router()

router.route('/')
  .get(getBanners)
  .post(authMiddleware, adminMiddleware, createBanner)

router.route('/:id')
  .put(authMiddleware, adminMiddleware, updateBanner)
  .delete(authMiddleware, adminMiddleware, deleteBanner)

export default router
