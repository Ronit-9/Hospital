import Doctor from '../models/Doctor.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// GET all doctors
export const getDoctors = async (req, res) => {
  const doctors = await Doctor.find({ isAvailable: true })
    .populate('userId', 'name email phone')
    .populate('department', 'name')
  return successResponse(res, 200, 'Doctors fetched', doctors)
}

// GET single doctor
export const getDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate('userId', 'name email phone')
    .populate('department', 'name')
  if (!doctor) {
    return errorResponse(res, 404, 'Doctor not found')
  }
  return successResponse(res, 200, 'Doctor fetched', doctor)
}

// POST create doctor — admin only
export const createDoctor = async (req, res) => {
  const {
    userId, department, specialization,
    qualifications, experience, consultFee, bio, availability
  } = req.body

  const exists = await Doctor.findOne({ userId })
  if (exists) {
    return errorResponse(res, 400, 'Doctor profile already exists')
  }

  const doctor = await Doctor.create({
    userId, department, specialization,
    qualifications, experience, consultFee, bio, availability
  })
  return successResponse(res, 201, 'Doctor created', doctor)
}

// PUT update doctor — admin only
export const updateDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  if (!doctor) {
    return errorResponse(res, 404, 'Doctor not found')
  }
  return successResponse(res, 200, 'Doctor updated', doctor)
}

// DELETE doctor — admin only
export const deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id)
  if (!doctor) {
    return errorResponse(res, 404, 'Doctor not found')
  }
  return successResponse(res, 200, 'Doctor deleted', {})
}

// GET doctors by department
export const getDoctorsByDepartment = async (req, res) => {
  const doctors = await Doctor.find({ department: req.params.departmentId })
    .populate('userId', 'name email phone')
    .populate('department', 'name')
  return successResponse(res, 200, 'Doctors fetched', doctors)
}