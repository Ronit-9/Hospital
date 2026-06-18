// index.js
import dotenv from 'dotenv'
dotenv.config()   // ✅ load env vars first

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRouter.js'
import { errorHandler } from './middleware/error.middleware.js'
import departmentRoutes from './routes/departmentRouter.js'
import appointmentRoutes from './routes/appointmentRouter.js'
import doctorRoutes from './routes/doctorRouter.js'
import reviewRoutes from './routes/reviewRouter.js'
import medicalRecordRoutes from './routes/medicalRecordRouter.js'
import paymentRoutes from './routes/paymentRouter.js'
import hospitalsettingsRoutes from './routes/hospitalsettingsRouter.js'
import serviceRoutes from './routes/serviceRouter.js'
import newsRoutes from './routes/newsRouter.js'
import contactRoutes from './routes/contactRouter.js'

const app = express()

// connect to MongoDB
connectDB()

// middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5175',
    'https://hospital-vmds.onrender.com'
  ],
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// root route
app.get('/', (req, res) => {
  res.send('Hospital Management API is running...')
})

// ✅ remove local uploads serving if using Cloudinary
// app.use('/uploads', express.static('uploads'))

// routes
app.use('/api/auth', authRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/records', medicalRecordRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/settings', hospitalsettingsRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/contact', contactRoutes)

// error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
