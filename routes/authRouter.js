import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/me').get(verifyToken, getMe)

export default router