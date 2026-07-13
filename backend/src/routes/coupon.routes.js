import express from 'express'
import { validateCoupon, getAllCoupons, createCoupon, updateCoupon, toggleCouponStatus, deleteCoupon, getAvailableCoupons } from '../controllers/coupon.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = express.Router()

router.use(authMiddleware) // All coupon routes require user authentication

router.get('/available', getAvailableCoupons)
router.post('/validate', validateCoupon)

// Admin-only coupon routes
router.use(adminMiddleware)
router.get('/', getAllCoupons)
router.post('/', createCoupon)
router.put('/:id', updateCoupon)
router.patch('/:id/status', toggleCouponStatus)
router.delete('/:id', deleteCoupon)

export default router
