import Service from '../models/Service.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import fs from 'fs'
import path from 'path'

// helper to delete old image file
const deleteOldImage = (imageUrl) => {
  if (!imageUrl) return
  const filename = imageUrl.split('/uploads/')[1]
  if (!filename) return
  const filepath = path.join('uploads', filename)
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
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
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
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
    deleteOldImage(service.image)
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
  deleteOldImage(service.image)

  return successResponse(res, 200, 'Service deleted', {})
}