import { Router } from 'express'
import { getRolePermissions, updateRolePermissions } from '../controllers/role.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = Router()

// All routes in this file are admin-protected
router.use(authMiddleware, adminMiddleware)

router.route('/:roleName').get(getRolePermissions).put(updateRolePermissions)

export default router