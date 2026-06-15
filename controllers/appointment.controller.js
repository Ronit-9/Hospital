import Appointment from '../models/Appointment.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// POST book appointment — patient only
export const bookAppointment = async (req, res) => {
  const { doctorId, date, timeSlot, type, symptoms } = req.body

  // check if slot already booked
  const exists = await Appointment.findOne({
    doctorId,
    date,
    timeSlot,
    status: { $in: ['pending', 'confirmed'] },
  })
  if (exists) {
    return errorResponse(res, 400, 'This time slot is already booked')
  }

  const appointment = await Appointment.create({
    patientId: req.user._id,
    doctorId,
    date,
    timeSlot,
    type,
    symptoms,
  })

  return successResponse(res, 201, 'Appointment booked', appointment)
}

// GET all appointments for logged in patient
export const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user._id })
    .populate('doctorId')
    .sort({ date: -1 })
  return successResponse(res, 200, 'Appointments fetched', appointments)
}

// GET all appointments for logged in doctor
export const getDoctorAppointments = async (req, res) => {
  const appointments = await Appointment.find({ doctorId: req.params.doctorId })
    .populate('patientId', 'name email phone')
    .sort({ date: -1 })
  return successResponse(res, 200, 'Appointments fetched', appointments)
}

// PUT update appointment status — doctor or admin
export const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  )
  if (!appointment) {
    return errorResponse(res, 404, 'Appointment not found')
  }
  return successResponse(res, 200, 'Appointment status updated', appointment)
}

// DELETE cancel appointment — patient only
export const cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)

  if (!appointment) {
    return errorResponse(res, 404, 'Appointment not found')
  }

  // only the patient who booked can cancel
  if (appointment.patientId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Not authorized to cancel this appointment')
  }

  appointment.status = 'cancelled'
  await appointment.save()

  return successResponse(res, 200, 'Appointment cancelled', appointment)
}

// GET all appointments — admin only
export const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patientId', 'name email')
    .populate('doctorId')
    .sort({ date: -1 })
  return successResponse(res, 200, 'All appointments fetched', appointments)
}