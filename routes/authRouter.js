import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  getAllUsers,
  getUser,
  deleteUser,
} from '../controllers/auth.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'

const router = express.Router()

router.route('/register').post(register).all(methodNotAllowed)
router.route('/login').post(login).all(methodNotAllowed)
router.route('/logout').post(logout).all(methodNotAllowed)

router.route('/me')
  .get(verifyToken, getMe)
  .put(verifyToken, upload.single('image'), updateMe)
  .all(methodNotAllowed)

router.route('/')
  .get(verifyToken, authorizeRoles('admin'), getAllUsers)
  .all(methodNotAllowed)

router.route('/:id')
  .get(verifyToken, authorizeRoles('admin'), getUser)
  .delete(verifyToken, authorizeRoles('admin'), deleteUser)
  .all(methodNotAllowed)

export default router