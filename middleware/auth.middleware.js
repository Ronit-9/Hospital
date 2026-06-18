import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token

  console.log('TOKEN:', token)        // add this
  console.log('CONTENT-TYPE:', req.headers['content-type'])  // add this

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' })
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id).select('-password')

  console.log('USER ROLE:', req.user?.role)   // add this

  next()
}
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      })
    }
    next()
  }
}