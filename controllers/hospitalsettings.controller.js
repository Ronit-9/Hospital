import HospitalSettings from '../models/Hospitalsettings.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

const defaultSchedule = [
  { day: 'Monday', open: '09:00 AM', close: '07:00 PM', isClosed: false },
  { day: 'Tuesday', open: '09:00 AM', close: '07:00 PM', isClosed: false },
  { day: 'Wednesday', open: '09:00 AM', close: '07:00 PM', isClosed: false },
  { day: 'Thursday', open: '09:00 AM', close: '07:00 PM', isClosed: false },
  { day: 'Friday', open: '09:00 AM', close: '07:00 PM', isClosed: false },
  { day: 'Saturday', open: '09:00 AM', close: '07:00 PM', isClosed: false },
  { day: 'Sunday', open: '', close: '', isClosed: true },
]

// GET hospital settings — public
export const getSettings = async (req, res) => {
  let settings = await HospitalSettings.findOne()

  // if no settings exist yet, create default
  if (!settings) {
    settings = await HospitalSettings.create({ scheduleHours: defaultSchedule })
  }

  return successResponse(res, 200, 'Settings fetched', settings)
}

// PUT update hospital settings — admin only
export const updateSettings = async (req, res) => {
  let settings = await HospitalSettings.findOne()

  if (!settings) {
    settings = await HospitalSettings.create({ scheduleHours: defaultSchedule })
  }

  const updated = await HospitalSettings.findByIdAndUpdate(
    settings._id,
    req.body,
    { new: true }
  )

  return successResponse(res, 200, 'Settings updated', updated)
}