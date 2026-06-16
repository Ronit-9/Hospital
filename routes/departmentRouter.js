import express from 'express'
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/department.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'

const router = express.Router()

router.route('/')
  .get(getDepartments)
  .post(verifyToken, authorizeRoles('admin'), createDepartment)
  .all(methodNotAllowed)

router.route('/:id')
  .get(getDepartment)
  .put(verifyToken, authorizeRoles('admin'), updateDepartment)
  .delete(verifyToken, authorizeRoles('admin'), deleteDepartment)
  .all(methodNotAllowed)

export default router