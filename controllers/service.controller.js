import Service from '../models/Service.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// ─── Public ───────────────────────────────────────────────

// GET all active services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
    return successResponse(res, 200, 'Services fetched', services)
  } catch (err) {
    return errorResponse(res, 500, 'Failed to fetch services')
  }
}

// GET single service
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return errorResponse(res, 404, 'Service not found')
    return successResponse(res, 200, 'Service fetched', service)
  } catch (err) {
    return errorResponse(res, 500, 'Failed to fetch service')
  }
}

// ─── Admin ────────────────────────────────────────────────

// GET all services including inactive
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
    return successResponse(res, 200, 'All services fetched', services)
  } catch (err) {
    return errorResponse(res, 500, 'Failed to fetch services')
  }
}

// CREATE service
export const createService = async (req, res) => {
  try {
    const { name, description, icon, image } = req.body || {}

    const exists = await Service.findOne({ name })
    if (exists) return errorResponse(res, 400, 'Service already exists')

    const service = await Service.create({
      name,
      description,
      icon,
      image: image || '',
    })

    return successResponse(res, 201, 'Service created', service)
  } catch (err) {
    return errorResponse(res, 500, 'Failed to create service')
  }
}

// UPDATE service
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return errorResponse(res, 404, 'Service not found')

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: req.body.image || service.image,
      },
      { new: true, runValidators: true }
    )

    return successResponse(res, 200, 'Service updated', updated)
  } catch (err) {
    return errorResponse(res, 500, 'Failed to update service')
  }
}

// DELETE service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return errorResponse(res, 404, 'Service not found')

    await Service.findByIdAndDelete(req.params.id)
    return successResponse(res, 200, 'Service deleted', {})
  } catch (err) {
    return errorResponse(res, 500, 'Failed to delete service')
  }
}