import Doctor from '../models/Doctor.js'
import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import fs from 'fs'
import path from 'path'

const deleteOldImage = (imageUrl) => {
  if (!imageUrl) return
  const filename = imageUrl.split('/uploads/')[1]
  if (!filename) return
  const filepath = path.join('uploads', filename)
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }
}

// GET all doctors
export const getDoctors = async (req, res) => {
  const doctors = await Doctor.find({ isAvailable: true })
    .populate('userId', 'name email phone profileImage')
    .populate('department', 'name')
  return successResponse(res, 200, 'Doctors fetched', doctors)
}

// GET single doctor
export const getDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate('userId', 'name email phone profileImage')
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
    qualifications, experience, consultFee, bio, availability, socialLinks
  } = req.body

  const exists = await Doctor.findOne({ userId })
  if (exists) {
    return errorResponse(res, 400, 'Doctor profile already exists')
  }

  const doctor = await Doctor.create({
    userId, department, specialization,
    qualifications, experience, consultFee, bio, availability, socialLinks
  })
  return successResponse(res, 201, 'Doctor created', doctor)
}

// PUT update doctor — admin only
export const updateDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('userId')
  if (!doctor) {
    return errorResponse(res, 404, 'Doctor not found')
  }

  // handle image — updates profileImage on linked User
  if (req.file) {
    deleteOldImage(doctor.userId.profileImage)
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    await User.findByIdAndUpdate(doctor.userId._id, { profileImage: imageUrl })
  }

  const updated = await Doctor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after' }
  )

  return successResponse(res, 200, 'Doctor updated', updated)
}

// DELETE doctor — admin only
export const deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('userId')
  if (!doctor) {
    return errorResponse(res, 404, 'Doctor not found')
  }

  deleteOldImage(doctor.userId.profileImage)
  await Doctor.findByIdAndDelete(req.params.id)

  return successResponse(res, 200, 'Doctor deleted', {})
}

// GET doctors by department
export const getDoctorsByDepartment = async (req, res) => {
  const doctors = await Doctor.find({ department: req.params.departmentId })
    .populate('userId', 'name email phone profileImage')
    .populate('department', 'name')
  return successResponse(res, 200, 'Doctors fetched', doctors)
}

// GET doctor availability
export const getDoctorAvailability = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
  if (!doctor) {
    return errorResponse(res, 404, 'Doctor not found')
  }

  const { date } = req.query
  if (!date) {
    return errorResponse(res, 400, 'Date is required')
  }

  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
  const dayAvailability = doctor.availability.find(a => a.day === dayName)

  if (!dayAvailability || dayAvailability.slots.length === 0) {
    return successResponse(res, 200, 'No slots available', { day: dayName, slots: [] })
  }

  return successResponse(res, 200, 'Availability fetched', {
    day: dayName,
    slots: dayAvailability.slots,
  })
}