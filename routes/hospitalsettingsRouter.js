import express from 'express'
import {
  getSettings,
  updateSettings,
} from '../controllers/hospitalsettings.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'
const router = express.Router()


router.route('/')
  .get(getSettings)
  .put(verifyToken, authorizeRoles('admin'), updateSettings)
  .all(methodNotAllowed)

export default router