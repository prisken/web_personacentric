const { cloudinary } = require('../config/cloudinary');
const { Readable } = require('stream');

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'personacentric') => {
  try {
    // Convert buffer to stream
    const stream = Readable.from(file.buffer);
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // Max dimensions
            { quality: 'auto', fetch_format: 'auto' } // Auto optimize
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      stream.pipe(uploadStream);
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result: result
    };
  } catch (error) {
    console.error('Image deletion error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate optimized URL for different sizes
const getOptimizedUrl = (url, options = {}) => {
  if (!url) return null;
  
  const { width, height, crop = 'fill', quality = 'auto' } = options;
  
  if (!width && !height) return url;
  
  // If it's already a Cloudinary URL, transform it
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const imagePath = url.split('/upload/')[1];
    
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`c_${crop}`);
    transformations.push(`q_${quality}`);
    
    return `${baseUrl}${transformations.join(',')}/${imagePath}`;
  }
  
  return url;
};

module.exports = {
  uploadImage,
  deleteImage,
  getOptimizedUrl
}; 