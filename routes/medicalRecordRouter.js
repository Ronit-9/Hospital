import express from 'express'
import {
  createMedicalRecord,
  getMyMedicalRecords,
  getMedicalRecord,
  getAllMedicalRecords,
} from '../controllers/medicalRecord.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'

const router = express.Router()

router.route('/').post(verifyToken, checkRole('doctor'), createMedicalRecord)
router.route('/my').get(verifyToken, checkRole('patient'), getMyMedicalRecords)
router.route('/:id').get(verifyToken, getMedicalRecord)
router.route('/all').get(verifyToken, checkRole('admin'), getAllMedicalRecords)

export default router