import { successResponse, errorResponse } from '../utils/apiResponse.js'
import generateToken from '../utils/generateToken.js'
import User from '../models/User.js'

export const register = async (req, res) => {
  const { name, email, password, role, phone } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    return errorResponse(res, 400, 'User already exists')
  }

  const user = await User.create({ name, email, password, role, phone })
  generateToken(res, user._id)

  return successResponse(res, 201, 'Registered successfully', {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user || !(await user.matchPassword(password))) {
    return errorResponse(res, 401, 'Invalid email or password')
  }

  generateToken(res, user._id)

  return successResponse(res, 200, 'Logged in successfully', {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
}

export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  })
  return successResponse(res, 200, 'Logged out successfully')
}

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  return successResponse(res, 200, 'User fetched', user)
}