import Payment from '../models/Payment.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// POST create payment — patient only
export const createPayment = async (req, res) => {
  const { appointmentId, amount, method, transactionId } = req.body

  const exists = await Payment.findOne({ appointmentId })
  if (exists) {
    return errorResponse(res, 400, 'Payment already exists for this appointment')
  }

  const payment = await Payment.create({
    appointmentId,
    patientId: req.user._id,
    amount,
    method,
    transactionId,
    status: 'paid',
    paidAt: new Date(),
  })

  return successResponse(res, 201, 'Payment created', payment)
}

// GET my payments — patient only
export const getMyPayments = async (req, res) => {
  const payments = await Payment.find({ patientId: req.user._id })
    .populate('appointmentId')
    .sort({ createdAt: -1 })
  return successResponse(res, 200, 'Payments fetched', payments)
}

// GET all payments — admin only
export const getAllPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate('patientId', 'name email')
    .populate('appointmentId')
    .sort({ createdAt: -1 })
  return successResponse(res, 200, 'All payments fetched', payments)
}

// PUT refund payment — admin only
export const refundPayment = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status: 'refunded' },
    { new: true }
  )
  if (!payment) {
    return errorResponse(res, 404, 'Payment not found')
  }
  return successResponse(res, 200, 'Payment refunded', payment)
}