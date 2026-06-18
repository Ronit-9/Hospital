import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import generateToken from '../utils/generateToken.js'
import fs from 'fs'
import path from 'path'

import cloudinary from '../config/cloudinary.js'

const deleteOldImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary')) return
  // extract public_id from url: .../meddical/abc123.jpg → meddical/abc123
  const parts = imageUrl.split('/')
  const filename = parts[parts.length - 1].split('.')[0]
  const publicId = `meddical/${filename}`
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.log('Cloudinary delete error:', err.message)
  }
}

// POST register
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

// POST login
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
    profileImage: user.profileImage,
  })
}

// POST logout
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  })
  return successResponse(res, 200, 'Logged out successfully')
}

// GET me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  return successResponse(res, 200, 'User fetched', user)
}

// PUT update own profile + image in one
export const updateMe = async (req, res) => {
  const { name, phone } = req.body

  if (req.file) {
    const currentUser = await User.findById(req.user._id)
    await deleteOldImage(currentUser.profileImage)
    req.body.profileImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, ...(req.body.profileImage && { profileImage: req.body.profileImage }) },
    { returnDocument: 'after' }
  ).select('-password')

  return successResponse(res, 200, 'Profile updated', user)
}

// GET all users — admin only
export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })
  return successResponse(res, 200, 'Users fetched', users)
}

// GET single user — admin only
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) {
    return errorResponse(res, 404, 'User not found')
  }
  return successResponse(res, 200, 'User fetched', user)
}

// DELETE user — admin only
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) {
    return errorResponse(res, 404, 'User not found')
  }
  await deleteOldImage(user.profileImage)
  return successResponse(res, 200, 'User deleted', {})
}