import News from '../models/News.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import cloudinary from '../config/cloudinary.js'

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
    ? req.file.path
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
    // delete old Cloudinary image
    if (news.image) {
      try {
        const publicId = news.image
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0]

        await cloudinary.uploader.destroy(publicId)
      } catch (error) {
        console.log('Old image delete failed:', error.message)
      }
    }

    // save new image URL
    req.body.image = req.file.path
  }

  const updated = await News.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  return successResponse(res, 200, 'News updated', updated)
}

// DELETE news — admin only
export const deleteNews = async (req, res) => {
  const news = await News.findById(req.params.id)

  if (!news) {
    return errorResponse(res, 404, 'News not found')
  }

  // delete image from Cloudinary
  if (news.image) {
    try {
      const publicId = news.image
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0]

      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.log('Image delete failed:', error.message)
    }
  }

  await news.deleteOne()

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