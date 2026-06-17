import Contact from '../models/Contact.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// POST send message — public
export const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    return errorResponse(res, 400, 'All fields are required')
  }

  const contact = await Contact.create({ name, email, subject, message })
  return successResponse(res, 201, 'Message sent successfully', contact)
}

// GET all messages — admin only
export const getMessages = async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 })
  return successResponse(res, 200, 'Messages fetched', messages)
}

// PUT mark as read — admin only
export const markAsRead = async (req, res) => {
  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { returnDocument: 'after' }
  )
  if (!message) return errorResponse(res, 404, 'Message not found')
  return successResponse(res, 200, 'Message marked as read', message)
}

// DELETE message — admin only
export const deleteMessage = async (req, res) => {
  const message = await Contact.findByIdAndDelete(req.params.id)
  if (!message) return errorResponse(res, 404, 'Message not found')
  return successResponse(res, 200, 'Message deleted', {})
}