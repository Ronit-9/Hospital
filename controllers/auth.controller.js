import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import generateToken from '../utils/generateToken.js'
import cloudinary from '../config/cloudinary.js'

// POST register
export const register = async (req, res) => {
  const { name, email, password, role, phone } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    return errorResponse(res, 400, 'User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
  })

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

// PUT update own profile + image
export const updateMe = async (req, res) => {
  const { name, phone } = req.body

  const currentUser = await User.findById(req.user._id)

  // If new image uploaded
  if (req.file) {
    // Delete old Cloudinary image if exists
    if (currentUser.profileImage) {
      try {
        const publicId = currentUser.profileImage
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0]

        await cloudinary.uploader.destroy(publicId)
      } catch (error) {
        console.log('Old image delete failed:', error.message)
      }
    }

    req.body.profileImage = req.file.path
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      phone,
      ...(req.body.profileImage && {
        profileImage: req.body.profileImage,
      }),
    },
    { new: true }
  ).select('-password')

  return successResponse(res, 200, 'Profile updated', user)
}

// GET all users — admin only
export const getAllUsers = async (req, res) => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })

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
  const user = await User.findById(req.params.id)

  if (!user) {
    return errorResponse(res, 404, 'User not found')
  }

  // Delete image from Cloudinary
  if (user.profileImage) {
    try {
      const publicId = user.profileImage
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0]

      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.log('Image delete failed:', error.message)
    }
  }

  await user.deleteOne()

  return successResponse(res, 200, 'User deleted', {})
}