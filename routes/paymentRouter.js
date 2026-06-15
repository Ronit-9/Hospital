import express from 'express'
import {
  createPayment,
  getMyPayments,
  getAllPayments,
  refundPayment,
} from '../controllers/payment.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.route('/').post(verifyToken, checkRole('patient'), createPayment)
router.route('/my').get(verifyToken, checkRole('patient'), getMyPayments)
router.route('/all').get(verifyToken, checkRole('admin'), getAllPayments)
router.route('/refund/:id').put(verifyToken, checkRole('admin'), refundPayment)

export default router