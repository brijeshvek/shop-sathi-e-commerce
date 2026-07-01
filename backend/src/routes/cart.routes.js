import express from 'express'
import { getCart, addToCart, updateCart, removeCartItem, clearCart, mergeGuestCart } from '../controllers/cart.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware) // All cart routes require user authentication

router.get('/', getCart)
router.post('/add', addToCart)
router.put('/update', updateCart)
router.delete('/remove/:cartItemId', removeCartItem)
router.delete('/clear', clearCart)
router.post('/merge', mergeGuestCart)

export default router
