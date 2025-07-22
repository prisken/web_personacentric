const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const { uploadImage, deleteImage } = require('../utils/imageUpload');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Upload single image
router.post('/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    console.log('=== Upload single image called ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'File received' : 'No file');
    
    if (!req.file) {
      console.log('No file provided');
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const folder = req.body.folder || 'personacentric';
    console.log('Uploading to folder:', folder);
    
    const result = await uploadImage(req.file, folder);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      image: {
        url: result.url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      }
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
});

// Upload multiple images
router.post('/images', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No image files provided'
      });
    }

    const folder = req.body.folder || 'personacentric';
    const uploadPromises = req.files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);

    res.json({
      success: true,
      images: successfulUploads.map(result => ({
        url: result.url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      })),
      failed: failedUploads.length,
      total: results.length
    });
  } catch (error) {
    console.error('Multiple upload route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload images'
    });
  }
});

// Delete image
router.delete('/image/:publicId', authenticateToken, async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await deleteImage(publicId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete image'
    });
  }
});

module.exports = router; 