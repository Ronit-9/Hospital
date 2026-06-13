import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRouter.js'
import { errorHandler } from './middleware/error.middleware.js'

dotenv.config()

const app = express()

connectDB()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// routes
app.use('/api/auth', authRoutes)

// error handler — only once, must be last
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})