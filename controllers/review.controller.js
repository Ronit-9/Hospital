import Review from '../models/Review.js'
import Appointment from '../models/Appointment.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// POST create review — patient only
export const createReview = async (req, res) => {
  const { doctorId, appointmentId, rating, comment } = req.body

  // check appointment is completed
  const appointment = await Appointment.findById(appointmentId)
  if (!appointment || appointment.status !== 'completed') {
    return errorResponse(res, 400, 'Can only review after completed appointment')
  }

  // check review doesnt already exist
  const exists = await Review.findOne({ appointmentId })
  if (exists) {
    return errorResponse(res, 400, 'You already reviewed this appointment')
  }

  const review = await Review.create({
    patientId: req.user._id,
    doctorId,
    appointmentId,
    rating,
    comment,
  })

  return successResponse(res, 201, 'Review submitted', review)
}

// GET all reviews for a doctor
export const getDoctorReviews = async (req, res) => {
  const reviews = await Review.find({ doctorId: req.params.doctorId })
    .populate('patientId', 'name')
    .sort({ createdAt: -1 })
  return successResponse(res, 200, 'Reviews fetched', reviews)
}

// DELETE review — admin only
export const deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id)
  if (!review) {
    return errorResponse(res, 404, 'Review not found')
  }
  return successResponse(res, 200, 'Review deleted', {})
}