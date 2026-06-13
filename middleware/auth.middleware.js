import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    })
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id).select('-password')
  next()
}