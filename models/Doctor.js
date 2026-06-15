import mongoose from 'mongoose'

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  slots: [String],
})

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualifications: [String],
  experience: {
    type: Number,
    default: 0,
  },
  consultFee: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  availability: [availabilitySchema],
  bio: {
    type: String,
    default: '',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true })

const Doctor = mongoose.model('Doctor', doctorSchema)
export default Doctor