import express from 'express'
import { getDashboardStats, getRevenueChart, getTopProducts, getOrdersChart } from '../controllers/analytics.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = express.Router()

router.use(authMiddleware, adminMiddleware) // All analytics routes require admin authentication

router.get('/dashboard', getDashboardStats)
router.get('/revenue', getRevenueChart)
router.get('/top-products', getTopProducts)
router.get('/orders', getOrdersChart)

export default router
