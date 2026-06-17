import express from 'express'
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from '../controllers/service.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

router.route('/')
  .get(getServices)
  .post(verifyToken, authorizeRoles('admin'), upload.single('image'), createService)
  .all(methodNotAllowed)

router.route('/:id')
  .get(getService)
  .put(verifyToken, authorizeRoles('admin'), upload.single('image'), updateService)
  .delete(verifyToken, authorizeRoles('admin'), deleteService)
  .all(methodNotAllowed)

export default router