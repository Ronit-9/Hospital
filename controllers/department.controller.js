import Department from '../models/Department.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// GET all departments
export const getDepartments = async (req, res) => {
  const departments = await Department.find({ isActive: true })
  return successResponse(res, 200, 'Departments fetched', departments)
}

// GET single department
export const getDepartment = async (req, res) => {
  const department = await Department.findById(req.params.id)
  if (!department) {
    return errorResponse(res, 404, 'Department not found')
  }
  return successResponse(res, 200, 'Department fetched', department)
}

// POST create department — admin only
export const createDepartment = async (req, res) => {
  const { name, description } = req.body
  const exists = await Department.findOne({ name })
  if (exists) {
    return errorResponse(res, 400, 'Department already exists')
  }
  const department = await Department.create({ name, description })
  return successResponse(res, 201, 'Department created', department)
}

// PUT update department — admin only
export const updateDepartment = async (req, res) => {
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  if (!department) {
    return errorResponse(res, 404, 'Department not found')
  }
  return successResponse(res, 200, 'Department updated', department)
}

// DELETE department — admin only
export const deleteDepartment = async (req, res) => {
  const department = await Department.findByIdAndDelete(req.params.id)
  if (!department) {
    return errorResponse(res, 404, 'Department not found')
  }
  return successResponse(res, 200, 'Department deleted', {})
}