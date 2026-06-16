import express from 'express'
import {
  createPayment,
  getMyPayments,
  getAllPayments,
  refundPayment,
} from '../controllers/payment.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'

const router = express.Router()

router.route('/')
  .post(verifyToken, authorizeRoles('patient'), createPayment)
  .all(methodNotAllowed)

router.route('/my')
  .get(verifyToken, authorizeRoles('patient'), getMyPayments)
  .all(methodNotAllowed)

router.route('/all')
  .get(verifyToken, authorizeRoles('admin'), getAllPayments)
  .all(methodNotAllowed)

router.route('/refund/:id')
  .put(verifyToken, authorizeRoles('admin'), refundPayment)
  .all(methodNotAllowed)

export default router