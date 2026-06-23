import express from 'express'
import {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsByDepartment,
  getDoctorAvailability,
  getMyDoctorProfile,
} from '../controllers/doctor.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'

const router = express.Router()

router.route('/')
  .get(getDoctors)
  .post(verifyToken, authorizeRoles('admin'), createDoctor)
  .all(methodNotAllowed)

router.route('/department/:departmentId')
  .get(getDoctorsByDepartment)
  .all(methodNotAllowed)

router.route('/me')
  .get(verifyToken, authorizeRoles('doctor'), getMyDoctorProfile)
  .all(methodNotAllowed)

router.route('/:id')
  .get(getDoctor)
  .put(verifyToken, authorizeRoles('admin'), updateDoctor)
  .delete(verifyToken, authorizeRoles('admin'), deleteDoctor)
  .all(methodNotAllowed)

router.route('/:id/availability')
  .get(getDoctorAvailability)
  .all(methodNotAllowed)

export default router