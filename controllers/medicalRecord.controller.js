import MedicalRecord from '../models/MedicalRecord.js'
import Appointment from '../models/Appointment.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// POST create medical record — doctor only
export const createMedicalRecord = async (req, res) => {
  const { patientId, appointmentId, diagnosis, prescription, followUpDate, notes } = req.body

  // check appointment exists and is completed
  const appointment = await Appointment.findById(appointmentId)
  if (!appointment) {
    return errorResponse(res, 404, 'Appointment not found')
  }

  // check record doesnt already exist for this appointment
  const exists = await MedicalRecord.findOne({ appointmentId })
  if (exists) {
    return errorResponse(res, 400, 'Medical record already exists for this appointment')
  }

  const record = await MedicalRecord.create({
    patientId,
    doctorId: req.user._id,
    appointmentId,
    diagnosis,
    prescription,
    followUpDate,
    notes,
  })

  // mark appointment as completed
  await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' })

  return successResponse(res, 201, 'Medical record created', record)
}

// GET all records for logged in patient
export const getMyMedicalRecords = async (req, res) => {
  const records = await MedicalRecord.find({ patientId: req.user._id })
    .populate('doctorId')
    .populate('appointmentId')
    .sort({ createdAt: -1 })
  return successResponse(res, 200, 'Medical records fetched', records)
}

// GET single medical record
export const getMedicalRecord = async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id)
    .populate('doctorId')
    .populate('patientId', 'name email phone')
    .populate('appointmentId')
  if (!record) {
    return errorResponse(res, 404, 'Medical record not found')
  }
  return successResponse(res, 200, 'Medical record fetched', record)
}

// GET all records — admin only
export const getAllMedicalRecords = async (req, res) => {
  const records = await MedicalRecord.find()
    .populate('doctorId')
    .populate('patientId', 'name email')
    .sort({ createdAt: -1 })
  return successResponse(res, 200, 'All medical records fetched', records)
}