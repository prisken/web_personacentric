const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const FoodForTalkUser = require('../models/FoodForTalkUser');
const FoodForTalkChatMessage = require('../models/FoodForTalkChatMessage');
const FoodForTalkProfileView = require('../models/FoodForTalkProfileView');
const { uploadToCloudinary } = require('../config/cloudinary');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Generate a random passkey
const generatePasskey = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Register for the event
router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  try {
    console.log('Food for Talk registration attempt - req.body:', req.body);
    console.log('Food for Talk registration attempt - req.file:', req.file);
    console.log('Food for Talk registration attempt - Content-Type:', req.headers['content-type']);
    
    const {
      firstName,
      lastName,
      email,
      phone,
      age,
      occupation,
      bio,
      dietaryRestrictions,
      emergencyContact,
      emergencyPhone,
      interests
    } = req.body;

    // Validate required fields
    console.log('Validating fields:');
    console.log('firstName:', firstName, typeof firstName);
    console.log('lastName:', lastName, typeof lastName);
    console.log('email:', email, typeof email);
    console.log('age:', age, typeof age);
    console.log('occupation:', occupation, typeof occupation);
    console.log('bio:', bio, typeof bio);
    console.log('emergencyContact:', emergencyContact, typeof emergencyContact);
    console.log('emergencyPhone:', emergencyPhone, typeof emergencyPhone);
    
    if (!firstName || !lastName || !email || !age || !occupation || !bio || !emergencyContact || !emergencyPhone) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields. Please fill in all required information.' 
      });
    }

    // Check if user already exists
    const existingUser = await FoodForTalkUser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }

    // Hash password (generate a random one for event users)
    const randomPassword = Math.random().toString(36).substring(2, 15);
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    // Upload profile photo if provided
    let profilePhotoUrl = null;
    if (req.file) {
      try {
        console.log('Uploading profile photo to Cloudinary...');
        const result = await uploadToCloudinary(req.file.buffer, {
          folder: 'food-for-talk/profiles',
          public_id: `${email.replace('@', '_at_')}_${Date.now()}`
        });
        profilePhotoUrl = result.secure_url;
        console.log('Profile photo uploaded successfully:', profilePhotoUrl);
      } catch (uploadError) {
        console.error('Profile photo upload error:', uploadError);
        // Continue without photo if upload fails
        profilePhotoUrl = null;
      }
    }

    // Parse interests
    let parsedInterests = [];
    try {
      parsedInterests = JSON.parse(interests || '[]');
    } catch (e) {
      parsedInterests = [];
    }

    // Generate secret passkey
    const secretPasskey = generatePasskey();

    // Create user
    const user = await FoodForTalkUser.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      age: parseInt(age),
      occupation,
      bio,
      interests: parsedInterests,
      dietary_restrictions: dietaryRestrictions,
      emergency_contact_name: emergencyContact,
      emergency_contact_phone: emergencyPhone,
      profile_photo_url: profilePhotoUrl,
      secret_passkey: secretPasskey,
      is_verified: true // Auto-verify for event registration
    });

    // Send confirmation email (you can implement this)
    // await sendEventRegistrationEmail(user.email, user.first_name);

    res.status(201).json({
      message: 'Registration successful! Check your email for login credentials.',
      userId: user.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// Login to view participants
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await FoodForTalkUser.findOne({ where: { email, is_active: true } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Get all participants (excluding sensitive info)
    const participants = await FoodForTalkUser.findAll({
      where: { is_active: true },
      attributes: [
        'id', 'first_name', 'last_name', 'age', 'occupation', 
        'bio', 'interests', 'profile_photo_url'
      ]
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      participants
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Secret chat room login
router.post('/secret-login', async (req, res) => {
  try {
    const { email, password, passkey } = req.body;

    const user = await FoodForTalkUser.findOne({ 
      where: { 
        email, 
        secret_passkey: passkey,
        is_active: true 
      } 
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or passkey' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Get all participants for chat (with blurred names)
    const participants = await FoodForTalkUser.findAll({
      where: { is_active: true },
      attributes: [
        'id', 'first_name', 'last_name', 'age', 'occupation', 
        'bio', 'interests', 'profile_photo_url'
      ]
    });

    // Add blurred names for chat
    const participantsWithBlurredNames = participants.map(p => ({
      ...p.toJSON(),
      blurredName: `${p.first_name.charAt(0)}***`
    }));

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        blurredName: `${user.first_name.charAt(0)}***`
      },
      participants: participantsWithBlurredNames
    });
  } catch (error) {
    console.error('Secret login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// View user profile (this will revoke the passkey)
router.post('/view-profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { userId: viewerId } = req.body;

    const user = await FoodForTalkUser.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const viewer = await FoodForTalkUser.findByPk(viewerId);
    if (!viewer) {
      return res.status(404).json({ message: 'Viewer not found' });
    }

    // Record the profile view
    await FoodForTalkProfileView.create({
      viewer_id: viewerId,
      viewed_user_id: userId,
      viewed_at: new Date()
    });

    // Revoke the viewer's passkey
    await viewer.update({ secret_passkey: null });

    // Return the user's profile (name and photo only)
    res.json({
      message: 'Profile viewed successfully',
      profile: {
        firstName: user.first_name,
        lastName: user.last_name,
        profilePhotoUrl: user.profile_photo_url,
        age: user.age,
        occupation: user.occupation,
        bio: user.bio,
        interests: user.interests
      }
    });
  } catch (error) {
    console.error('View profile error:', error);
    res.status(500).json({ message: 'Failed to view profile' });
  }
});

// Get chat messages
router.get('/chat-messages', async (req, res) => {
  try {
    const { conversationId, limit = 50, offset = 0 } = req.query;

    let whereClause = {};
    if (conversationId) {
      whereClause.conversation_id = conversationId;
    }

    const messages = await FoodForTalkChatMessage.findAll({
      where: whereClause,
      order: [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: FoodForTalkUser,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: FoodForTalkUser,
          as: 'recipient',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    res.json({ messages });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Failed to get chat messages' });
  }
});

// Save chat message
router.post('/chat-messages', async (req, res) => {
  try {
    const { senderId, recipientId, content, messageType, conversationId } = req.body;

    const message = await FoodForTalkChatMessage.create({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      message_type: messageType,
      conversation_id: conversationId
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Save chat message error:', error);
    res.status(500).json({ message: 'Failed to save message' });
  }
});

// Get event statistics
router.get('/stats', async (req, res) => {
  try {
    const totalParticipants = await FoodForTalkUser.count({
      where: { is_active: true }
    });

    const verifiedParticipants = await FoodForTalkUser.count({
      where: { is_active: true, is_verified: true }
    });

    const totalMessages = await FoodForTalkChatMessage.count();

    res.json({
      totalParticipants,
      verifiedParticipants,
      totalMessages
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to get statistics' });
  }
});

module.exports = router;
