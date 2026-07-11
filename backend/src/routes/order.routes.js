import express from 'express'
import { placeOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus, cancelOrder, getRazorpayKey, verifyPayment, payPendingOrder, requestReturn, requestExchange, updateItemReturnStatus, updateItemExchangeStatus } from '../controllers/order.controller.js'
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
router.post('/:id/items/:itemId/return', requestReturn)
router.post('/:id/items/:itemId/exchange', requestExchange)

// Admin-only order routes
router.get('/', adminMiddleware, getAllOrders)
router.put('/:id/status', adminMiddleware, updateOrderStatus)
router.put('/:id/items/:itemId/return-status', adminMiddleware, updateItemReturnStatus)
router.put('/:id/items/:itemId/exchange-status', adminMiddleware, updateItemExchangeStatus)

export default router
