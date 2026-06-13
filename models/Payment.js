import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  method: {
    type: String,
    enum: ['cash', 'esewa', 'khalti', 'card'],
    default: 'cash',
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    default: '',
  },
  paidAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true })

export default mongoose.model('Payment', paymentSchema)