import News from '../models/News.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import fs from 'fs'
import path from 'path'
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js'
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
  console.log('REQ.FILE:', req.file)
  console.log('REQ.BODY:', req.body)

  const { title, content, excerpt, tags } = req.body

  let image = req.body.image || ''
  if (req.file) {
    console.log('ATTEMPTING CLOUDINARY UPLOAD...')
    try {
      const result = await uploadToCloudinary(req.file.buffer)
      console.log('CLOUDINARY RESULT:', result)
      image = result.secure_url
    } catch (uploadErr) {
      console.log('CLOUDINARY UPLOAD FAILED:', uploadErr)
    }
  }

  console.log('FINAL IMAGE VALUE:', image)

  const news = await News.create({
    title, content, excerpt, image, tags,
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
    await deleteOldImage(news.image)
    const result = await uploadToCloudinary(req.file.buffer)
    req.body.image = result.secure_url
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
  await deleteOldImage(news.image)

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