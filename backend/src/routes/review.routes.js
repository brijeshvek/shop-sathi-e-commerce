import express from 'express'
import { getProductReviews, submitReview, editReview, deleteReview } from '../controllers/review.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/:productId', getProductReviews) // Public route: read product reviews

// Secure review actions requiring user authentication
router.post('/:productId', authMiddleware, submitReview)
router.put('/:reviewId', authMiddleware, editReview)
router.delete('/:reviewId', authMiddleware, deleteReview)

export default router
