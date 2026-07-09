import express from 'express'
import { getAllUsers, getUserById, updateUser, changePassword, blockUser, addAddress, updateAddress, deleteAddress, setDefaultAddress, becomeSeller } from '../controllers/user.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.post  ('/become-seller',                     becomeSeller)
router.get   ('/',                                  adminMiddleware, getAllUsers)
router.get   ('/:id',                               getUserById)
router.put   ('/:id',                               updateUser)
router.put   ('/:id/password',                      changePassword)
router.put   ('/:id/block',                         adminMiddleware, blockUser)
router.post  ('/:id/addresses',                     addAddress)
router.put   ('/:id/addresses/:addressId',          updateAddress)
router.delete('/:id/addresses/:addressId',          deleteAddress)
router.patch ('/:id/addresses/:addressId/default',  setDefaultAddress)

export default router
