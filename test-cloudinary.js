import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ping test — checks API auth without uploading anything
cloudinary.api.ping()
  .then((result) => console.log('PING SUCCESS:', result))
  .catch((err) => console.log('PING FAILED:', JSON.stringify(err, null, 2)))