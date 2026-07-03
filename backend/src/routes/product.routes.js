import express from 'express'
import { 
  getAllProducts, getFeaturedProducts, getProductBySlug, 
  createProduct, updateProduct, deleteProduct, toggleProductStatus,
  getAllProductsAdmin, getProductByIdAdmin
} from '../controllers/product.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'
import { requirePermission } from '../middleware/role.middleware.js'

const router = express.Router()

router.get('/featured',   getFeaturedProducts)
router.get('/',           getAllProducts)
router.get('/:slug',      getProductBySlug)

// Admin-only product routes
router.get('/admin/list', authMiddleware, requirePermission('canViewProducts'), getAllProductsAdmin)
router.get('/admin/:id',  authMiddleware, requirePermission('canViewProducts'), getProductByIdAdmin)
router.post  ('/',            authMiddleware, requirePermission('canManageProducts'), createProduct)
router.put   ('/:id',         authMiddleware, requirePermission('canManageProducts'), updateProduct)
router.delete('/:id',         authMiddleware, requirePermission('canDeleteProducts'), deleteProduct)
router.patch ('/:id/status',  authMiddleware, requirePermission('canManageProducts'), toggleProductStatus)

export default router
