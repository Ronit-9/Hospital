import Doctor from '../models/Doctor.js'
import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import cloudinary from '../config/cloudinary.js'

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
    userId,
    department,
    specialization,
    qualifications,
    experience,
    consultFee,
    bio,
    availability,
    socialLinks,
  } = req.body

  const exists = await Doctor.findOne({ userId })

  if (exists) {
    return errorResponse(res, 400, 'Doctor profile already exists')
  }

  const doctor = await Doctor.create({
    userId,
    department,
    specialization,
    qualifications,
    experience,
    consultFee,
    bio,
    availability,
    socialLinks,
  })

  return successResponse(res, 201, 'Doctor created', doctor)
}

// PUT update doctor — admin only
export const updateDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('userId')

  if (!doctor) {
    return errorResponse(res, 404, 'Doctor not found')
  }

  // handle image upload (updates linked User profile image)
  if (req.file) {
    // delete old image from Cloudinary
    if (doctor.userId.profileImage) {
      try {
        const publicId = doctor.userId.profileImage
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0]

        await cloudinary.uploader.destroy(publicId)
      } catch (error) {
        console.log('Old image delete failed:', error.message)
      }
    }

    // save new Cloudinary image URL
    await User.findByIdAndUpdate(doctor.userId._id, {
      profileImage: req.file.path,
    })
  }

  const updated = await Doctor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  return successResponse(res, 200, 'Doctor updated', updated)
}

// DELETE doctor — admin only
export const deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('userId')

  if (!doctor) {
    return errorResponse(res, 404, 'Doctor not found')
  }

  // delete image from Cloudinary
  if (doctor.userId.profileImage) {
    try {
      const publicId = doctor.userId.profileImage
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0]

      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.log('Image delete failed:', error.message)
    }
  }

  await Doctor.findByIdAndDelete(req.params.id)

  return successResponse(res, 200, 'Doctor deleted', {})
}

// GET doctors by department
export const getDoctorsByDepartment = async (req, res) => {
  const doctors = await Doctor.find({
    department: req.params.departmentId,
  })
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

  const dayName = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
  })

  const dayAvailability = doctor.availability.find(
    (a) => a.day === dayName
  )

  if (!dayAvailability || dayAvailability.slots.length === 0) {
    return successResponse(res, 200, 'No slots available', {
      day: dayName,
      slots: [],
    })
  }

  return successResponse(res, 200, 'Availability fetched', {
    day: dayName,
    slots: dayAvailability.slots,
  })
}