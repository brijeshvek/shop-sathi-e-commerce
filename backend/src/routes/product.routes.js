import express from 'express'
import { getAllProducts, getFeaturedProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, toggleProductStatus } from '../controllers/product.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = express.Router()

router.get('/featured',   getFeaturedProducts)
router.get('/',           getAllProducts)
router.get('/:slug',      getProductBySlug)
router.post  ('/',            authMiddleware, adminMiddleware, createProduct)
router.put   ('/:id',         authMiddleware, adminMiddleware, updateProduct)
router.delete('/:id',         authMiddleware, adminMiddleware, deleteProduct)
router.patch ('/:id/status',  authMiddleware, adminMiddleware, toggleProductStatus)

export default router
