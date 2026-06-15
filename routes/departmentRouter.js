import express from 'express'
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/department.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.route('/').get(getDepartments)
router.route('/:id').get(getDepartment)
router.route('/').post(verifyToken, checkRole('admin'), createDepartment)
router.route('/:id').put(verifyToken, checkRole('admin'), updateDepartment)
router.route('/:id').delete(verifyToken, checkRole('admin'), deleteDepartment)

export default router