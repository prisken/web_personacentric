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

// Generate a 6-digit numeric passkey
const generatePasskey = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register for the event
router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  try {
    console.log('Food for Talk registration attempt:', req.body);
    
    const {
      email,
      password,
      whatsappPhone,
      age,
      interests,
      // New fields
      nickname,
      gender,
      expectPersonType,
      dreamFirstDate,
      dreamFirstDateOther,
      interestsOther,
      attractiveTraits,
      attractiveTraitsOther,
      japaneseFoodPreference,
      quickfireMagicItemChoice,
      quickfireDesiredOutcome,
      consentAccepted
    } = req.body;

    // Validate required fields
    if (!email || !password || !age) {
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

    let parsedAttractiveTraits = [];
    try {
      parsedAttractiveTraits = JSON.parse(attractiveTraits || '[]');
    } catch (e) {
      parsedAttractiveTraits = [];
    }

    // Generate secret passkey
    const secretPasskey = generatePasskey();

    // Prepare base data (safe across legacy schema)
    const baseData = {
      email,
      password_hash: passwordHash,
      first_name: 'Anonymous',
      last_name: 'Participant',
      phone: whatsappPhone,
      age: parseInt(age),
      // Legacy schemas may require these fields to be NOT NULL; use safe defaults
      occupation: '',
      bio: bio || '',
      interests: parsedInterests,
      dietary_restrictions: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      profile_photo_url: profilePhotoUrl,
      secret_passkey: secretPasskey,
      is_verified: true
    };

    // Attempt to include expanded fields; if DB lacks columns, retry with baseData
    let user;
    try {
      user = await FoodForTalkUser.create({
        ...baseData,
        nickname: nickname || null,
        gender: gender || null,
        expect_person_type: expectPersonType || null,
        dream_first_date: dreamFirstDate || null,
        dream_first_date_other: dreamFirstDateOther || null,
        interests_other: interestsOther || null,
        attractive_traits: parsedAttractiveTraits,
        attractive_traits_other: attractiveTraitsOther || null,
        japanese_food_preference: japaneseFoodPreference || null,
        quickfire_magic_item_choice: quickfireMagicItemChoice || null,
        quickfire_desired_outcome: quickfireDesiredOutcome || null,
        consent_accepted: consentAccepted === 'true' || consentAccepted === true
      });
    } catch (createErr) {
      console.warn('Create with expanded fields failed, retrying with baseData only:', createErr?.message);
      user = await FoodForTalkUser.create(baseData);
    }

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

    if (!user.password_hash) {
      console.warn('User missing password_hash for email:', email);
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
    console.log('Creating JWT token with secret:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
    let token;
    try {
      token = jwt.sign(
        { userId: user.id, email: user.email, type: 'food-for-talk-participant' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );
    } catch (signErr) {
      console.error('JWT sign error:', signErr);
      return res.status(500).json({ message: 'Authentication failed. Please try again.' });
    }
    console.log('JWT token created successfully');

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
    console.error('Login error:', error?.message, error?.stack);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Secret login for chat room (requires passkey)
router.post('/secret-login', async (req, res) => {
  try {
    const { email, password, passkey } = req.body;

    // Option A: Already logged in as participant via JWT
    let user = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        if (decoded.type === 'food-for-talk-participant' && decoded.email) {
          user = await FoodForTalkUser.findOne({ where: { email: decoded.email } });
        }
      } catch (e) {
        // ignore and fallback to email/password flow
      }
    }

    // Option B: Email/password supplied
    if (!user) {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required when not already logged in' });
      }
      user = await FoodForTalkUser.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
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

// Get participants list (requires authentication)
router.get('/participants', async (req, res) => {
  try {
    console.log('Participants endpoint called');
    console.log('Authorization header:', req.headers.authorization);
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid Authorization header found');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    console.log('Token extracted:', token.substring(0, 50) + '...');
    console.log('JWT_SECRET being used:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
    
    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      console.log('Token decoded successfully:', decoded);
      if (decoded.type !== 'food-for-talk-participant') {
        console.log('Invalid token type:', decoded.type);
        return res.status(401).json({ message: 'Invalid token type' });
      }
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError.message);
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get all participants (excluding sensitive info like passwords and passkeys)
    const participants = await FoodForTalkUser.findAll({
      where: { is_active: true, is_verified: true },
      order: [['created_at', 'ASC']]
    });

    // Format participants data
    const formattedParticipants = participants.map(participant => ({
      id: participant.id,
      firstName: participant.first_name,
      lastName: participant.last_name,
      nickname: participant.nickname,
      gender: participant.gender,
      age: participant.age,
      bio: participant.bio,
      interests: participant.interests || [],
      profilePhotoUrl: participant.profile_photo_url
    }));

    res.json({
      message: 'Participants retrieved successfully',
      participants: formattedParticipants
    });
  } catch (error) {
    console.error('Get participants error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Failed to retrieve participants' });
  }
});

// Get participants for chat room (with blurred names)
router.get('/chat-participants', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    if (decoded.type !== 'food-for-talk-secret') {
      return res.status(401).json({ message: 'Invalid token type' });
    }

    // Get all participants for chat (with blurred names)
    const participants = await FoodForTalkUser.findAll({
      where: { is_active: true, is_verified: true },
      attributes: [
        'id', 'first_name', 'last_name', 'age', 'occupation', 
        'bio', 'interests', 'dietary_restrictions', 'profile_photo_url'
      ],
      order: [['created_at', 'ASC']]
    });

    // Format participants with blurred names for chat
    const participantsWithBlurredNames = participants.map(participant => ({
      id: participant.id,
      firstName: participant.first_name ? participant.first_name.charAt(0) + '***' : 'Anonymous',
      lastName: participant.last_name ? participant.last_name.charAt(0) + '***' : '',
      age: participant.age,
      occupation: participant.occupation,
      bio: participant.bio,
      interests: participant.interests || [],
      dietaryRestrictions: participant.dietary_restrictions,
      profilePhotoUrl: participant.profile_photo_url
    }));

    res.json({
      message: 'Chat participants retrieved successfully',
      participants: participantsWithBlurredNames
    });
  } catch (error) {
    console.error('Get chat participants error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Failed to retrieve chat participants' });
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
