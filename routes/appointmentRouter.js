import express from 'express'
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments,
} from '../controllers/appointment.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

// patient routes
router.route('/book').post(verifyToken, checkRole('patient'), bookAppointment)
router.route('/my').get(verifyToken, checkRole('patient'), getMyAppointments)
router.route('/cancel/:id').put(verifyToken, checkRole('patient'), cancelAppointment)

// doctor routes
router.route('/doctor/:doctorId').get(verifyToken, checkRole('doctor'), getDoctorAppointments)

// doctor or admin
router.route('/status/:id').put(verifyToken, checkRole('doctor', 'admin'), updateAppointmentStatus)

// admin only
router.route('/all').get(verifyToken, checkRole('admin'), getAllAppointments)

export default router