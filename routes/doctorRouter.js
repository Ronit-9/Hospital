import express from 'express'
import {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsByDepartment,
} from '../controllers/doctor.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.route('/').get(getDoctors)
router.route('/:id').get(getDoctor)
router.route('/department/:departmentId').get(getDoctorsByDepartment)
router.route('/').post(verifyToken, checkRole('admin'), createDoctor)
router.route('/:id').put(verifyToken, checkRole('admin'), updateDoctor)
router.route('/:id').delete(verifyToken, checkRole('admin'), deleteDoctor)

export default router