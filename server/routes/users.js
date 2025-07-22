const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const { uploadImage } = require('../utils/imageUpload');
const { Agent } = require('../models');

// Trivial change to force redeploy
// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Profile updated successfully'
  });
});

// Update agent profile with image upload
router.put('/agent/profile', authenticateToken, upload.single('profile_image'), async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the agent record for this user
    const agent = await Agent.findOne({ where: { user_id: userId } });
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent profile not found'
      });
    }

    // Handle profile image upload if provided
    let profileImageUrl = agent.profile_image; // Keep existing if no new image
    
    if (req.file) {
      console.log('=== Uploading agent profile image ===');
      const result = await uploadImage(req.file, 'agent-profiles');
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Failed to upload profile image: ' + result.error
        });
      }
      
      profileImageUrl = result.url;
      console.log('Profile image uploaded:', profileImageUrl);
    }

    // Update agent profile data
    const updateData = {
      ...req.body,
      profile_image: profileImageUrl
    };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.user_id;
    delete updateData.created_at;
    delete updateData.updated_at;

    await agent.update(updateData);

    res.json({
      success: true,
      message: 'Agent profile updated successfully',
      data: {
        ...agent.toJSON(),
        profile_image: profileImageUrl
      }
    });
  } catch (error) {
    console.error('Agent profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update agent profile'
    });
  }
});

module.exports = router; 