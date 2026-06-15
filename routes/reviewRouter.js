import express from 'express'
import {
  createReview,
  getDoctorReviews,
  deleteReview,
} from '../controllers/review.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.route('/').post(verifyToken, checkRole('patient'), createReview)
router.route('/doctor/:doctorId').get(getDoctorReviews)
router.route('/:id').delete(verifyToken, checkRole('admin'), deleteReview)

export default router