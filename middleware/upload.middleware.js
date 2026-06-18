
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// ensure uploads folder exists
const uploadDir = 'uploads/'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
    cb(null, uniqueName)
  },
})

// file filter — images only
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/
  const ext = allowed.test(path.extname(file.originalname).toLowerCase())
  const mime = allowed.test(file.mimetype)
  if (ext && mime) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
})

export default upload