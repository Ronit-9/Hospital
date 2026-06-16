import express from 'express'
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments,
} from '../controllers/appointment.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'

const router = express.Router()

router.route('/')
  .post(verifyToken, authorizeRoles('patient'), bookAppointment)
  .get(verifyToken, authorizeRoles('admin'), getAllAppointments)
  .all(methodNotAllowed)

router.route('/my')
  .get(verifyToken, authorizeRoles('patient'), getMyAppointments)
  .all(methodNotAllowed)

router.route('/doctor/:doctorId')
  .get(verifyToken, authorizeRoles('doctor', 'admin'), getDoctorAppointments)
  .all(methodNotAllowed)

router.route('/:id/status')
  .put(verifyToken, authorizeRoles('doctor', 'admin'), updateAppointmentStatus)
  .all(methodNotAllowed)

router.route('/:id/cancel')
  .put(verifyToken, authorizeRoles('patient'), cancelAppointment)
  .all(methodNotAllowed)

export default router