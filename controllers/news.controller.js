import News from '../models/News.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import fs from 'fs'
import path from 'path'

const deleteOldImage = (imageUrl) => {
  if (!imageUrl) return
  const filename = imageUrl.split('/uploads/')[1]
  if (!filename) return
  const filepath = path.join('uploads', filename)
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }
}

// GET all published news
export const getAllNews = async (req, res) => {
  const news = await News.find({ isPublished: true })
    .populate('author', 'name profileImage')
    .sort({ publishedAt: -1 })
  return successResponse(res, 200, 'News fetched', news)
}

// GET single news — also increments views
export const getNews = async (req, res) => {
  const news = await News.findById(req.params.id)
    .populate('author', 'name profileImage')
  if (!news) {
    return errorResponse(res, 404, 'News not found')
  }
  news.views += 1
  await news.save()
  return successResponse(res, 200, 'News fetched', news)
}

// POST create news — admin only
export const createNews = async (req, res) => {
  const { title, content, excerpt, tags } = req.body

  const image = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : req.body.image || ''

  const news = await News.create({
    title,
    content,
    excerpt,
    image,
    tags,
    author: req.user._id,
    publishedAt: new Date(),
  })

  return successResponse(res, 201, 'News created', news)
}

// PUT update news — admin only
export const updateNews = async (req, res) => {
  const news = await News.findById(req.params.id)
  if (!news) {
    return errorResponse(res, 404, 'News not found')
  }

  if (req.file) {
    // delete old image before saving new one
    deleteOldImage(news.image)
    req.body.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  }

  const updated = await News.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after' }
  )

  return successResponse(res, 200, 'News updated', updated)
}

// DELETE news — admin only
export const deleteNews = async (req, res) => {
  const news = await News.findByIdAndDelete(req.params.id)
  if (!news) {
    return errorResponse(res, 404, 'News not found')
  }

  // delete image file when news is deleted
  deleteOldImage(news.image)

  return successResponse(res, 200, 'News deleted', {})
}

// PUT like a news post — any logged in user
export const likeNews = async (req, res) => {
  const news = await News.findById(req.params.id)
  if (!news) {
    return errorResponse(res, 404, 'News not found')
  }
  news.likes += 1
  await news.save()
  return successResponse(res, 200, 'News liked', news)
}