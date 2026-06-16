import express from 'express'
import {
  createReview,
  getDoctorReviews,
  deleteReview,
} from '../controllers/review.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'

const router = express.Router()

router.route('/')
  .post(verifyToken, authorizeRoles('patient'), createReview)
  .all(methodNotAllowed)

router.route('/doctor/:doctorId')
  .get(getDoctorReviews)
  .all(methodNotAllowed)

router.route('/:id')
  .delete(verifyToken, authorizeRoles('admin'), deleteReview)
  .all(methodNotAllowed)

export default router