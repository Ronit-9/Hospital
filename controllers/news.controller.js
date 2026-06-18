import News from '../models/News.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// GET all published news
export const getAllNews = async (req, res) => {
  const news = await News.find({ isPublished: true })
    .populate('author', 'name profileImage')
    .sort({ publishedAt: -1 })

  return successResponse(res, 200, 'News fetched', news)
}

// GET single news
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

// CREATE news (image link only)
export const createNews = async (req, res) => {
  const { title, content, excerpt, tags, image } = req.body

  const news = await News.create({
    title,
    content,
    excerpt,
    image: image || '',
    tags,
    author: req.user._id,
    publishedAt: new Date(),
  })

  return successResponse(res, 201, 'News created', news)
}

// UPDATE news (image link only)
export const updateNews = async (req, res) => {
  const news = await News.findById(req.params.id)

  if (!news) {
    return errorResponse(res, 404, 'News not found')
  }

  const updated = await News.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      image: req.body.image || news.image
    },
    { new: true }
  )

  return successResponse(res, 200, 'News updated', updated)
}

// DELETE news
export const deleteNews = async (req, res) => {
  const news = await News.findByIdAndDelete(req.params.id)

  if (!news) {
    return errorResponse(res, 404, 'News not found')
  }

  return successResponse(res, 200, 'News deleted', {})
}

// LIKE news
export const likeNews = async (req, res) => {
  const news = await News.findById(req.params.id)

  if (!news) {
    return errorResponse(res, 404, 'News not found')
  }

  news.likes += 1
  await news.save()

  return successResponse(res, 200, 'News liked', news)
}