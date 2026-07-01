import express from 'express'
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware) // All wishlist routes require user authentication

router.get('/', getWishlist)
router.post('/add', addToWishlist)
router.delete('/remove/:productId', removeFromWishlist)

export default router
