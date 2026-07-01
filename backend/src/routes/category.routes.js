import express from 'express'
import { getAllCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory, toggleCategoryStatus } from '../controllers/category.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = express.Router()

router.get('/',        getAllCategories)
router.get('/:slug',   getCategoryBySlug)
router.post  ('/',                        authMiddleware, adminMiddleware, createCategory)
router.put   ('/:id',                     authMiddleware, adminMiddleware, updateCategory)
router.delete('/:id',                     authMiddleware, adminMiddleware, deleteCategory)
router.patch ('/:id/status',              authMiddleware, adminMiddleware, toggleCategoryStatus)

export default router
