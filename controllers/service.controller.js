import Service from '../models/Service.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
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
    // delete uploaded file if service already exists
    if (req.file) deleteOldImage(`/uploads/${req.file.filename}`)
    return errorResponse(res, 400, 'Service already exists')
  }

  const image = req.file
    ? req.file.path
    : req.body.image || ''

  const service = await Service.create({ name, description, icon, image })
  return successResponse(res, 201, 'Service created', service)
}

// PUT update service — admin only
export const updateService = async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) {
    return errorResponse(res, 404, 'Service not found')
  }

  if (req.file) {
    // delete old image before saving new one
    await deleteOldImage(service.image)
    req.body.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  }

  const updated = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after' }
  )

  return successResponse(res, 200, 'Service updated', updated)
}

// DELETE service — admin only
export const deleteService = async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id)
  if (!service) {
    return errorResponse(res, 404, 'Service not found')
  }

  // delete image file when service is deleted
  await deleteOldImage(service.image)

  return successResponse(res, 200, 'Service deleted', {})
}