import express from 'express'
import {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} from '../controllers/contact.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'

const router = express.Router()

router.route('/')
  .post(sendMessage)
  .get(verifyToken, authorizeRoles('admin'), getMessages)
  .all(methodNotAllowed)

router.route('/:id')
  .put(verifyToken, authorizeRoles('admin'), markAsRead)
  .delete(verifyToken, authorizeRoles('admin'), deleteMessage)
  .all(methodNotAllowed)

export default router