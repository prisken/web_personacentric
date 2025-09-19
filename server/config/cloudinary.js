const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload function for Food for Talk
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

module.exports = { cloudinary, uploadToCloudinary }; 