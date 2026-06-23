import Doctor from '../models/Doctor.js'
import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// GET all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isAvailable: true })
      .populate('userId', 'name email phone profileImage')
      .populate('department', 'name')
    return successResponse(res, 200, 'Doctors fetched', doctors)
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}
// GET my doctor profile — logged in doctor only
export const getMyDoctorProfile = async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user._id })
    .populate('userId', 'name email phone profileImage')
    .populate('department', 'name')
  if (!doctor) {
    return errorResponse(res, 404, 'Doctor profile not found')
  }
  return successResponse(res, 200, 'Doctor profile fetched', doctor)
}

// GET single doctor
export const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email phone profileImage')
      .populate('department', 'name')
    if (!doctor) return errorResponse(res, 404, 'Doctor not found')
    return successResponse(res, 200, 'Doctor fetched', doctor)
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// POST create doctor — admin only
export const createDoctor = async (req, res) => {
  try {
    const {
      userId, department, specialization,
      qualifications, experience, consultFee,
      bio, availability, socialLinks, image,
    } = req.body

    const exists = await Doctor.findOne({ userId })
    if (exists) return errorResponse(res, 400, 'Doctor profile already exists')

    // if image URL provided, update the user's profileImage
    if (image) {
      await User.findByIdAndUpdate(userId, { profileImage: image })
    }

    const doctor = await Doctor.create({
      userId, department, specialization,
      qualifications, experience, consultFee,
      bio, availability, socialLinks,
    })

    return successResponse(res, 201, 'Doctor created', doctor)
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// PUT update doctor — admin only
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId')
    if (!doctor) return errorResponse(res, 404, 'Doctor not found')

    const { image, ...rest } = req.body

    // if new image URL provided, update the user's profileImage
    if (image) {
      await User.findByIdAndUpdate(doctor.userId._id, { profileImage: image })
    }

    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      rest,
      { new: true, runValidators: true }
    )

    return successResponse(res, 200, 'Doctor updated', updated)
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// DELETE doctor — admin only
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return errorResponse(res, 404, 'Doctor not found')

    await Doctor.findByIdAndDelete(req.params.id)
    return successResponse(res, 200, 'Doctor deleted', {})
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// GET doctors by department
export const getDoctorsByDepartment = async (req, res) => {
  try {
    const doctors = await Doctor.find({ department: req.params.departmentId })
      .populate('userId', 'name email phone profileImage')
      .populate('department', 'name')
    return successResponse(res, 200, 'Doctors fetched', doctors)
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// GET doctor availability
export const getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return errorResponse(res, 404, 'Doctor not found')

    const { date } = req.query
    if (!date) return errorResponse(res, 400, 'Date is required')

    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
    const dayAvailability = doctor.availability.find((a) => a.day === dayName)

    if (!dayAvailability || dayAvailability.slots.length === 0) {
      return successResponse(res, 200, 'No slots available', { day: dayName, slots: [] })
    }

    return successResponse(res, 200, 'Availability fetched', {
      day: dayName,
      slots: dayAvailability.slots,
    })
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}