import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/role.middleware.js'
import {
  getSellerAnalytics,
  getSellerProducts,
  getSellerOrders,
} from '../controllers/seller.controller.js'

const router = express.Router()

// All seller routes require auth + seller/admin role
router.use(authMiddleware)
router.use(authorize('seller', 'admin', 'superadmin'))

router.get('/analytics', getSellerAnalytics)
router.get('/products',  getSellerProducts)
router.get('/orders',    getSellerOrders)

export default router
