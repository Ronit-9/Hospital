import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: '',
  },
}, { timestamps: true })

// recalculate doctor rating after every review saved
reviewSchema.post('save', async function () {
  const Doctor = mongoose.model('Doctor')
  const result = await mongoose.model('Review').aggregate([
    { $match: { doctorId: this.doctorId } },
    { $group: { _id: '$doctorId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ])
  if (result.length > 0) {
    await Doctor.findByIdAndUpdate(this.doctorId, {
      rating: result[0].avgRating.toFixed(1),
      totalReviews: result[0].count,
    })
  }
})

export default mongoose.model('Review', reviewSchema)