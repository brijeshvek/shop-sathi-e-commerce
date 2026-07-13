import express from 'express';
import {
  getCategoryAttributes,
  getAllCategoryAttributes,
  upsertCategoryAttributes,
  deleteCategoryAttributes
} from '../controllers/attribute.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import { requirePermission } from '../middleware/role.middleware.js';

const router = express.Router();

// Public routes (used by frontend to render dynamic fields)
router.get('/category/:categoryId', getCategoryAttributes);

// Admin only routes (used in Dashboard to manage attributes)
router.get('/', authMiddleware, requirePermission('canManageCategories'), getAllCategoryAttributes);
router.put('/category/:categoryId', authMiddleware, requirePermission('canManageCategories'), upsertCategoryAttributes);
router.delete('/category/:categoryId', authMiddleware, requirePermission('canManageCategories'), deleteCategoryAttributes);

export default router;
