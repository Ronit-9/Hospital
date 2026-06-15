import mongoose from 'mongoose'

const prescriptionSchema = new mongoose.Schema({
  medicine: String,
  dosage: String,
  duration: String,
})

const medicalRecordSchema = new mongoose.Schema({
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  prescription: [prescriptionSchema],
  followUpDate: {
    type: Date,
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true })

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema)
export default MedicalRecord