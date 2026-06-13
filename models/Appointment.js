import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['in-person', 'online'],
    default: 'in-person',
  },
  symptoms: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true })

export default mongoose.model('Appointment', appointmentSchema)