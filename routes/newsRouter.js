import express from 'express'
import {
  getAllNews,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  likeNews,
} from '../controllers/news.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js'
import { methodNotAllowed } from '../utils/methodNotAllowed.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

router.route('/')
  .get(getAllNews)
  .post(verifyToken, authorizeRoles('admin'), upload.single('image'), createNews)
  .all(methodNotAllowed)

router.route('/:id')
  .get(getNews)
  .put(verifyToken, authorizeRoles('admin'), upload.single('image'), updateNews)
  .delete(verifyToken, authorizeRoles('admin'), deleteNews)
  .all(methodNotAllowed)

router.route('/:id/like')
  .put(verifyToken, likeNews)
  .all(methodNotAllowed)

export default router