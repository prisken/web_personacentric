const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
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
    console.log('Food for Talk registration attempt:', req.body);
    
    const {
      firstName,
      lastName,
      email,
      password,
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
    if (!firstName || !lastName || !email || !password || !age || !occupation || !bio || !emergencyContact || !emergencyPhone) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please fill in all required information.' 
      });
    }

    // Check if user already exists
    const existingUser = await FoodForTalkUser.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ 
        message: 'This email is already registered for the Food for Talk event. Please use a different email address.' 
      });
    }

    // Hash the provided password
    const passwordHash = await bcrypt.hash(password, 12);

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
      message: 'Registration successful! You can now login with your email and password.',
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

// Login for participants (for "See Participants" functionality)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await FoodForTalkUser.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(401).json({ message: 'Account not verified. Please contact support.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'food-for-talk-participant'
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        hasPasskey: !!user.secret_passkey
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Secret login for chat room (requires passkey)
router.post('/secret-login', async (req, res) => {
  try {
    const { email, password, passkey } = req.body;

    if (!email || !password || !passkey) {
      return res.status(400).json({ message: 'Email, password, and passkey are required' });
    }

    // Find user
    const user = await FoodForTalkUser.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check passkey
    if (!user.secret_passkey || user.secret_passkey !== passkey) {
      return res.status(401).json({ message: 'Invalid passkey' });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(401).json({ message: 'Account not verified. Please contact support.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'food-for-talk-secret'
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Secret login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        passkey: user.secret_passkey
      }
    });
  } catch (error) {
    console.error('Secret login error:', error);
    res.status(500).json({ message: 'Secret login failed. Please try again.' });
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
