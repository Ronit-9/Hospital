import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import generateToken from '../utils/generateToken.js'
import fs from 'fs'
import path from 'path'

// Utility: delete old local image
const deleteOldImage = (imageUrl) => {
  if (!imageUrl) return
  const filename = imageUrl.split('/uploads/')[1]
  if (!filename) return
  const filepath = path.join('uploads', filename)
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }
}

// POST register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body

    const exists = await User.findOne({ email })
    if (exists) {
      return errorResponse(res, 400, 'User already exists')
    }

    const user = await User.create({ name, email, password, role, phone })
    generateToken(res, user._id)

    return successResponse(res, 201, 'User registered', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
    })
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// POST login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return errorResponse(res, 401, 'Invalid credentials')
    }

    generateToken(res, user._id)

    return successResponse(res, 200, 'Login successful', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
    })
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// POST logout
export const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    return successResponse(res, 200, 'Logged out successfully')
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// GET me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    return successResponse(res, 200, 'User fetched', user)
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// PUT update own profile + image
export const updateMe = async (req, res) => {
  try {
    const { name, phone } = req.body
    let profileImage

    if (req.file) {
      const currentUser = await User.findById(req.user._id)
      deleteOldImage(currentUser.profileImage)
      profileImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, ...(profileImage && { profileImage }) },
      { returnDocument: 'after' }
    ).select('-password')

    return successResponse(res, 200, 'Profile updated', user)
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// GET all users — admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    return successResponse(res, 200, 'Users fetched', users)
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// GET single user — admin only
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return errorResponse(res, 404, 'User not found')
    }
    return successResponse(res, 200, 'User fetched', user)
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}

// DELETE user — admin only
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return errorResponse(res, 404, 'User not found')
    }

    deleteOldImage(user.profileImage)
    await User.findByIdAndDelete(req.params.id)

    return successResponse(res, 200, 'User deleted', {})
  } catch (err) {
    return errorResponse(res, 500, 'Server error', err.message)
  }
}
