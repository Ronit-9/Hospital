import express from 'express'
import {
  getServices,
  getService,
  getAllServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/service.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'

const router = express.Router()

router.route('/')
  .get(getServices)                                             // public — active only
  .post(verifyToken, authorizeRoles('admin'), createService)   // admin
  .all(methodNotAllowed)

router.route('/admin/all')
  .get(verifyToken, authorizeRoles('admin'), getAllServices)    // admin — all including inactive
  .all(methodNotAllowed)

router.route('/:id')
  .get(getService)                                             // public
  .put(verifyToken, authorizeRoles('admin'), updateService)    // admin
  .delete(verifyToken, authorizeRoles('admin'), deleteService) // admin
  .all(methodNotAllowed)

export default router