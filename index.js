import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB from './config/db.js'

dotenv.config()

const app = express()

// connect mongodb
connectDB()

// middleware
app.use(cors({
  origin: 'http://localhost:5173',  // vite react url
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// test route
app.get('/', (req, res) => {
  res.json({ message: 'MEDDICAL API running ✅' })
})

// start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})