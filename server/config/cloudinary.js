const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log configuration (without exposing secrets)
console.log('=== Cloudinary Configuration ===');
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set');
console.log('API key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
console.log('API secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');

module.exports = cloudinary; 