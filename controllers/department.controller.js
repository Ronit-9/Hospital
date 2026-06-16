import Department from '../models/Department.js'
import Doctor from '../models/Doctor.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// GET all departments with doctor count
export const getDepartments = async (req, res) => {
  const departments = await Department.find({ isActive: true })

  const departmentsWithCount = await Promise.all(
    departments.map(async (dept) => {
      const doctorCount = await Doctor.countDocuments({ department: dept._id })
      return {
        ...dept.toObject(),
        doctorCount,
      }
    })
  )

  return successResponse(res, 200, 'Departments fetched', departmentsWithCount)
}

// GET single department with doctors
export const getDepartment = async (req, res) => {
  const department = await Department.findById(req.params.id)
  if (!department) {
    return errorResponse(res, 404, 'Department not found')
  }

  // also get doctors in this department
  const doctors = await Doctor.find({ department: req.params.id })
    .populate('userId', 'name email phone profileImage')

  return successResponse(res, 200, 'Department fetched', {
    ...department.toObject(),
    doctors,
  })
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
    { returnDocument: 'after' }
  )
  if (!department) {
    return errorResponse(res, 404, 'Department not found')
  }
  return successResponse(res, 200, 'Department updated', department)
}

// DELETE department — admin only
export const deleteDepartment = async (req, res) => {
  const department = await Department.findById(req.params.id)
  if (!department) {
    return errorResponse(res, 404, 'Department not found')
  }

  // check if doctors exist in this department
  const doctorCount = await Doctor.countDocuments({ department: req.params.id })
  if (doctorCount > 0) {
    return errorResponse(res, 400, `Cannot delete — ${doctorCount} doctor(s) still assigned to this department`)
  }

  await Department.findByIdAndDelete(req.params.id)
  return successResponse(res, 200, 'Department deleted', {})
}