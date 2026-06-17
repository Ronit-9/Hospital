import Service from '../models/Service.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import cloudinary from '../config/cloudinary.js'

// GET all active services
export const getServices = async (req, res) => {
  const services = await Service.find({ isActive: true })

  return successResponse(res, 200, 'Services fetched', services)
}

// GET single service
export const getService = async (req, res) => {
  const service = await Service.findById(req.params.id)

  if (!service) {
    return errorResponse(res, 404, 'Service not found')
  }

  return successResponse(res, 200, 'Service fetched', service)
}

// POST create service — admin only
export const createService = async (req, res) => {
  const { name, description, icon } = req.body

  const exists = await Service.findOne({ name })

  if (exists) {
    // if upload already happened, delete from Cloudinary
    if (req.file) {
      try {
        const publicId = req.file.path
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0]

        await cloudinary.uploader.destroy(publicId)
      } catch (error) {
        console.log('Uploaded image cleanup failed:', error.message)
      }
    }

    return errorResponse(res, 400, 'Service already exists')
  }

  const image = req.file
    ? req.file.path
    : req.body.image || ''

  const service = await Service.create({
    name,
    description,
    icon,
    image,
  })

  return successResponse(res, 201, 'Service created', service)
}

// PUT update service — admin only
export const updateService = async (req, res) => {
  const service = await Service.findById(req.params.id)

  if (!service) {
    return errorResponse(res, 404, 'Service not found')
  }

  if (req.file) {
    // delete old Cloudinary image
    if (service.image) {
      try {
        const publicId = service.image
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0]

        await cloudinary.uploader.destroy(publicId)
      } catch (error) {
        console.log('Old image delete failed:', error.message)
      }
    }

    req.body.image = req.file.path
  }

  const updated = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  return successResponse(res, 200, 'Service updated', updated)
}

// DELETE service — admin only
export const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id)

  if (!service) {
    return errorResponse(res, 404, 'Service not found')
  }

  // delete image from Cloudinary
  if (service.image) {
    try {
      const publicId = service.image
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0]

      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.log('Image delete failed:', error.message)
    }
  }

  await service.deleteOne()

  return successResponse(res, 200, 'Service deleted', {})
}