import cloudinary from "../utils/cloudinary.js";

const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];


const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};


export const fileCheck = async (req, res, next) => {
  const file = req.files?.image;

  if (!file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  if (!supportedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid file type. Only jpg, jpeg, png, gif, bmp allowed.',
    });
  }

  try {
    const url = await uploadToCloudinary(file.data, 'posts');
    req.imagePath = url; // full https://res.cloudinary.com/... URL
    next();
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ message: 'Image upload failed' });
  }
};

// PUT /api/posts/:id — image is optional
export const updateFileCheck = async (req, res, next) => {
  const file = req.files?.image;

  if (!file) return next(); // no image attached — skip

  if (!supportedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid file type. Only jpg, jpeg, png, gif, bmp allowed.',
    });
  }

  try {
    const url = await uploadToCloudinary(file.data, 'posts');
    req.imagePath = url;
    next();
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ message: 'Image upload failed' });
  }
};