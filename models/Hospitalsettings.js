import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  open: {
    type: String,
    default: '09:00 AM',
  },
  close: {
    type: String,
    default: '07:00 PM',
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
})

const hospitalSettingsSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    default: 'Meddical',
  },
  emergencyPhone: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  scheduleHours: [scheduleSchema],
}, { timestamps: true })

const HospitalSettings = mongoose.model('HospitalSettings', hospitalSettingsSchema)
export default HospitalSettings