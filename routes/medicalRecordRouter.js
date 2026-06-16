import express from 'express'
import {
  createMedicalRecord,
  getMyMedicalRecords,
  getMedicalRecord,
  getAllMedicalRecords,
} from '../controllers/medicalRecord.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'

const router = express.Router()

router.route('/')
  .post(verifyToken, authorizeRoles('doctor'), createMedicalRecord)
  .get(verifyToken, authorizeRoles('admin'), getAllMedicalRecords)
  .all(methodNotAllowed)

router.route('/my')
  .get(verifyToken, authorizeRoles('patient'), getMyMedicalRecords)
  .all(methodNotAllowed)

router.route('/:id')
  .get(verifyToken, authorizeRoles('doctor', 'admin', 'patient'), getMedicalRecord)
  .all(methodNotAllowed)

export default router