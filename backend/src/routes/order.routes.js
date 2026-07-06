import express from 'express'
import { placeOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus, cancelOrder, getRazorpayKey, verifyPayment, payPendingOrder } from '../controllers/order.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = express.Router()

router.use(authMiddleware) // All order routes require user authentication

router.post('/', placeOrder)
router.get('/razorpay-key', getRazorpayKey)
router.post('/verify-payment', verifyPayment)
router.get('/my-orders', getMyOrders)
router.get('/:id', getOrderById)
router.post('/:id/pay', payPendingOrder)
router.put('/:id/cancel', cancelOrder)

// Admin-only order routes
router.get('/', adminMiddleware, getAllOrders)
router.put('/:id/status', adminMiddleware, updateOrderStatus)

export default router
