const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const FoodForTalkUser = require('../models/FoodForTalkUser');
const FoodForTalkChatMessage = require('../models/FoodForTalkChatMessage');
const FoodForTalkProfileView = require('../models/FoodForTalkProfileView');
const { uploadToCloudinary } = require('../config/cloudinary');
const emailService = require('../services/emailService');
const { Op } = require('sequelize');

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
      bio,
      // Basic info fields
      firstName,
      lastName,
      nickname,
      gender,
      // Additional info fields
      occupation,
      dietaryRestrictions,
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
    if (!email || !password || !age || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please fill in all required information including first name and last name.' 
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
      first_name: firstName || 'Anonymous',
      last_name: lastName || 'Participant',
      phone: whatsappPhone,
      age: parseInt(age),
      // Additional fields from form
      occupation: occupation || '',
      bio: bio || '',
      interests: parsedInterests,
      dietary_restrictions: dietaryRestrictions || '',
      profile_photo_url: profilePhotoUrl,
      secret_passkey: secretPasskey,
      is_verified: true
    };

    // Check which columns exist in the production DB to avoid schema mismatches
    let user;
    try {
      const columns = await require('../config/database').getQueryInterface().describeTable('food_for_talk_users');
      const existingColumns = Object.keys(columns);

      // Build data object with only columns that actually exist in the DB
      const createData = {};
      Object.keys(baseData).forEach((key) => {
        if (existingColumns.includes(key)) {
          createData[key] = baseData[key];
        }
      });

      // Only add optional/new columns if they exist in the database
      if (existingColumns.includes('nickname')) createData.nickname = nickname || null;
      if (existingColumns.includes('gender')) createData.gender = gender || null;
      if (existingColumns.includes('expect_person_type')) createData.expect_person_type = expectPersonType || null;
      if (existingColumns.includes('dream_first_date')) createData.dream_first_date = dreamFirstDate || null;
      if (existingColumns.includes('dream_first_date_other')) createData.dream_first_date_other = dreamFirstDateOther || null;
      if (existingColumns.includes('interests_other')) createData.interests_other = interestsOther || null;
      if (existingColumns.includes('attractive_traits')) createData.attractive_traits = parsedAttractiveTraits;
      if (existingColumns.includes('attractive_traits_other')) createData.attractive_traits_other = attractiveTraitsOther || null;
      if (existingColumns.includes('japanese_food_preference')) createData.japanese_food_preference = japaneseFoodPreference || null;
      if (existingColumns.includes('quickfire_magic_item_choice')) createData.quickfire_magic_item_choice = quickfireMagicItemChoice || null;
      if (existingColumns.includes('quickfire_desired_outcome')) createData.quickfire_desired_outcome = quickfireDesiredOutcome || null;
      if (existingColumns.includes('consent_accepted')) createData.consent_accepted = consentAccepted === 'true' || consentAccepted === true;
      if (existingColumns.includes('whatsapp_phone')) createData.whatsapp_phone = whatsappPhone;

      user = await FoodForTalkUser.create(createData);
    } catch (createErr) {
      console.warn('Create with schema-safe approach failed, retrying with baseData only:', createErr?.message);
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
        interests: (() => {
          try {
            return user.interests ? JSON.parse(user.interests) : [];
          } catch (e) {
            return [];
          }
        })()
      }
    });
  } catch (error) {
    console.error('View profile error:', error);
    res.status(500).json({ message: 'Failed to view profile' });
  }
});

// Get current participant profile (self-viewing)
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      if (decoded.type !== 'food-for-talk-participant') {
        return res.status(401).json({ message: 'Invalid token type' });
      }
    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { userId } = decoded;
    const participant = await FoodForTalkUser.findByPk(userId, {
      attributes: [
        'id', 'email', 'first_name', 'last_name', 'nickname', 'gender', 'age',
        'phone', 'whatsapp_phone', 'occupation', 'bio', 'interests',
        'interests_other', 'dietary_restrictions', 'expect_person_type', 'dream_first_date',
        'dream_first_date_other', 'attractive_traits', 'attractive_traits_other',
        'japanese_food_preference', 'quickfire_magic_item_choice',
        'quickfire_desired_outcome', 'consent_accepted', 'profile_photo_url',
        'created_at', 'updated_at'
      ]
    });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    const formattedParticipant = {
      id: participant.id,
      email: participant.email,
      firstName: participant.first_name,
      lastName: participant.last_name,
      nickname: participant.nickname,
      gender: participant.gender,
      age: participant.age,
      phone: participant.phone,
      whatsappPhone: participant.whatsapp_phone,
      occupation: participant.occupation,
      bio: participant.bio,
      interests: (() => {
        try {
          // Handle different formats from database
          if (Array.isArray(participant.interests)) {
            return participant.interests;
          } else if (typeof participant.interests === 'string') {
            // Try JSON.parse first
            try {
              return JSON.parse(participant.interests);
            } catch (jsonError) {
              // If JSON.parse fails, it might be comma-separated string
              return participant.interests.split(',').map(item => item.trim());
            }
          }
          return [];
        } catch (e) {
          return [];
        }
      })(),
      interestsOther: participant.interests_other,
      dietaryRestrictions: participant.dietary_restrictions,
      profilePhotoUrl: participant.profile_photo_url,
      createdAt: participant.created_at,
      expectPersonType: participant.expect_person_type,
      dreamFirstDate: participant.dream_first_date,
      dreamFirstDateOther: participant.dream_first_date_other,
      attractiveTraits: (() => {
        try {
          // Handle different formats from database
          if (Array.isArray(participant.attractive_traits)) {
            return participant.attractive_traits;
          } else if (typeof participant.attractive_traits === 'string') {
            // Try JSON.parse first
            try {
              return JSON.parse(participant.attractive_traits);
            } catch (jsonError) {
              // If JSON.parse fails, it might be comma-separated string
              return participant.attractive_traits.split(',').map(item => item.trim());
            }
          }
          return [];
        } catch (e) {
          return [];
        }
      })(),
      attractiveTraitsOther: participant.attractive_traits_other,
      japaneseFoodPreference: participant.japanese_food_preference,
      quickfireMagicItemChoice: participant.quickfire_magic_item_choice,
      quickfireDesiredOutcome: participant.quickfire_desired_outcome,
      consentAccepted: participant.consent_accepted
    };

    res.json({
      message: 'Profile retrieved successfully',
      participant: formattedParticipant
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
});

// Update participant profile (self-editing)
router.put('/profile', async (req, res) => {
  try {
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      if (decoded.type !== 'food-for-talk-participant') {
        return res.status(401).json({ message: 'Invalid token type' });
      }
    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { userId } = decoded;
    
    const updateData = req.body;

    const participant = await FoodForTalkUser.findByPk(userId);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Validate required fields
    if (updateData.email && !updateData.email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (updateData.age && (isNaN(updateData.age) || updateData.age < 18 || updateData.age > 100)) {
      return res.status(400).json({ message: 'Age must be between 18 and 100' });
    }

    // Prepare update object with only allowed fields for self-editing
    const allowedFields = [
      'first_name', 'last_name', 'nickname', 'gender', 'age',
      'phone', 'whatsapp_phone', 'occupation', 'bio', 'interests',
      'interests_other', 'dietary_restrictions', 'expect_person_type', 
      'dream_first_date', 'dream_first_date_other', 'attractive_traits', 
      'attractive_traits_other', 'japanese_food_preference', 
      'quickfire_magic_item_choice', 'quickfire_desired_outcome', 'consent_accepted',
    ];

    // Map camelCase payload keys to snake_case DB columns
    const camelToSnakeMap = {
      firstName: 'first_name',
      lastName: 'last_name',
      nickname: 'nickname',
      gender: 'gender',
      age: 'age',
      phone: 'phone',
      whatsappPhone: 'whatsapp_phone',
      occupation: 'occupation',
      bio: 'bio',
      interests: 'interests',
      interestsOther: 'interests_other',
      dietaryRestrictions: 'dietary_restrictions',
      expectPersonType: 'expect_person_type',
      dreamFirstDate: 'dream_first_date',
      dreamFirstDateOther: 'dream_first_date_other',
      attractiveTraits: 'attractive_traits',
      attractiveTraitsOther: 'attractive_traits_other',
      japaneseFoodPreference: 'japanese_food_preference',
      quickfireMagicItemChoice: 'quickfire_magic_item_choice',
      quickfireDesiredOutcome: 'quickfire_desired_outcome',
      consentAccepted: 'consent_accepted'
    };

    const filteredUpdateData = {};

    // Accept both snake_case and camelCase inputs, only allow permitted fields
    Object.entries(updateData).forEach(([key, value]) => {
      const snakeKey = camelToSnakeMap[key] || key;
      if (!allowedFields.includes(snakeKey)) return;
      if (snakeKey === 'consent_accepted') {
        filteredUpdateData[snakeKey] = value === true || value === 'true';
      } else if (snakeKey === 'age') {
        const ageNumber = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!Number.isNaN(ageNumber)) filteredUpdateData[snakeKey] = ageNumber;
      } else if (snakeKey === 'interests' || snakeKey === 'attractive_traits') {
        if (Array.isArray(value)) filteredUpdateData[snakeKey] = value;
      } else {
        filteredUpdateData[snakeKey] = value;
      }
    });

    // Update participant
    await participant.update(filteredUpdateData);

    // Return updated participant data
    const updatedParticipant = await FoodForTalkUser.findByPk(userId, {
      attributes: [
        'id', 'email', 'first_name', 'last_name', 'nickname', 'gender', 'age',
        'phone', 'whatsapp_phone', 'occupation', 'bio', 'interests',
        'interests_other', 'dietary_restrictions', 'expect_person_type', 
        'dream_first_date', 'dream_first_date_other', 'attractive_traits', 
        'attractive_traits_other', 'japanese_food_preference', 
        'quickfire_magic_item_choice', 'quickfire_desired_outcome', 'consent_accepted',
        'profile_photo_url', 'created_at', 'updated_at'
      ]
    });

    // Format the response to match frontend expectations
    const formattedParticipant = {
      id: updatedParticipant.id,
      email: updatedParticipant.email,
      firstName: updatedParticipant.first_name,
      lastName: updatedParticipant.last_name,
      nickname: updatedParticipant.nickname,
      gender: updatedParticipant.gender,
      age: updatedParticipant.age,
      phone: updatedParticipant.phone,
      whatsappPhone: updatedParticipant.whatsapp_phone,
      occupation: updatedParticipant.occupation,
      bio: updatedParticipant.bio,
      interests: (() => {
        try {
          if (Array.isArray(updatedParticipant.interests)) {
            return updatedParticipant.interests;
          } else if (typeof updatedParticipant.interests === 'string') {
            return JSON.parse(updatedParticipant.interests);
          }
          return [];
        } catch (e) {
          return [];
        }
      })(),
      interestsOther: updatedParticipant.interests_other,
      dietaryRestrictions: updatedParticipant.dietary_restrictions,
      profilePhotoUrl: updatedParticipant.profile_photo_url,
      expectPersonType: updatedParticipant.expect_person_type,
      dreamFirstDate: updatedParticipant.dream_first_date,
      dreamFirstDateOther: updatedParticipant.dream_first_date_other,
      attractiveTraits: (() => {
        try {
          if (Array.isArray(updatedParticipant.attractive_traits)) {
            return updatedParticipant.attractive_traits;
          } else if (typeof updatedParticipant.attractive_traits === 'string') {
            return JSON.parse(updatedParticipant.attractive_traits);
          }
          return [];
        } catch (e) {
          return [];
        }
      })(),
      attractiveTraitsOther: updatedParticipant.attractive_traits_other,
      japaneseFoodPreference: updatedParticipant.japanese_food_preference,
      quickfireMagicItemChoice: updatedParticipant.quickfire_magic_item_choice,
      quickfireDesiredOutcome: updatedParticipant.quickfire_desired_outcome,
      consentAccepted: updatedParticipant.consent_accepted
    };

    res.json({ 
      message: 'Profile updated successfully',
      participant: formattedParticipant
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
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
        { userId: user.id, email: user.email, nickname: user.nickname, type: 'food-for-talk-participant' },
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

// Food for Talk - Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const user = await FoodForTalkUser.findOne({ where: { email } });
    if (!user) {
      return res.json({ success: true, message: 'If an account exists, a reset email has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.update({ reset_password_token: resetToken, reset_password_expires: resetExpires });
    try {
      await emailService.sendFoodForTalkPasswordResetEmail(user.email, resetToken);
    } catch (emailErr) {
      console.error('FFT reset email send failed (continuing):', emailErr?.message);
      // Intentionally continue to avoid leaking email existence or failing the flow
    }

    return res.json({ success: true, message: 'If an account exists, a reset email has been sent' });
  } catch (err) {
    console.error('FFT forgot password error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Food for Talk - Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: 'Token and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    const user = await FoodForTalkUser.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: new Date() }
      }
    });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await user.update({
      password_hash: passwordHash,
      reset_password_token: null,
      reset_password_expires: null
    });

    return res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('FFT reset password error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
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

    // Option B: Already logged in participant but only passkey sent
    // Option C: Email/password supplied
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
        nickname: user.nickname,
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

// Get detailed participant information (for regular users - no contact info)
router.get('/participants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      if (decoded.type !== 'food-for-talk-participant') {
        return res.status(401).json({ message: 'Invalid token type' });
      }
    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get participant details (excluding contact information)
    const participant = await FoodForTalkUser.findByPk(id, {
      attributes: [
        'id', 'nickname', 'gender', 'age', 'bio', 'interests', 'interests_other',
        'expect_person_type', 'dream_first_date', 'dream_first_date_other',
        'attractive_traits', 'attractive_traits_other', 'japanese_food_preference',
        'quickfire_magic_item_choice', 'quickfire_desired_outcome', 'consent_accepted',
        'occupation', 'dietary_restrictions',
        'profile_photo_url', 'created_at'
      ]
    });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Format participant data for regular users (no contact info)
    const formattedParticipant = {
      id: participant.id,
      nickname: participant.nickname,
      gender: participant.gender,
      age: participant.age,
      bio: participant.bio,
      occupation: participant.occupation,
      interests: (() => {
        try {
          // Handle different formats from database
          if (Array.isArray(participant.interests)) {
            return participant.interests;
          } else if (typeof participant.interests === 'string') {
            // Try JSON.parse first
            try {
              return JSON.parse(participant.interests);
            } catch (jsonError) {
              // If JSON.parse fails, it might be comma-separated string
              return participant.interests.split(',').map(item => item.trim());
            }
          }
          return [];
        } catch (e) {
          return [];
        }
      })(),
      interestsOther: participant.interests_other,
      dietaryRestrictions: participant.dietary_restrictions,
      profilePhotoUrl: participant.profile_photo_url,
      createdAt: participant.created_at,
      // Expanded registration fields
      expectPersonType: participant.expect_person_type,
      dreamFirstDate: participant.dream_first_date,
      dreamFirstDateOther: participant.dream_first_date_other,
      attractiveTraits: (() => {
        try {
          // Handle different formats from database
          if (Array.isArray(participant.attractive_traits)) {
            return participant.attractive_traits;
          } else if (typeof participant.attractive_traits === 'string') {
            // Try JSON.parse first
            try {
              return JSON.parse(participant.attractive_traits);
            } catch (jsonError) {
              // If JSON.parse fails, it might be comma-separated string
              return participant.attractive_traits.split(',').map(item => item.trim());
            }
          }
          return [];
        } catch (e) {
          return [];
        }
      })(),
      attractiveTraitsOther: participant.attractive_traits_other,
      japaneseFoodPreference: participant.japanese_food_preference,
      quickfireMagicItemChoice: participant.quickfire_magic_item_choice,
      quickfireDesiredOutcome: participant.quickfire_desired_outcome,
      consentAccepted: participant.consent_accepted
    };

    res.json({
      message: 'Participant details retrieved successfully',
      participant: formattedParticipant
    });
  } catch (error) {
    console.error('Get participant details error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Failed to retrieve participant details' });
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

    // Get participants using only columns that exist in the DB (prod-safe)
    const columns = await require('../config/database').getQueryInterface().describeTable('food_for_talk_users');
    const existingColumns = Object.keys(columns);
    const participants = await FoodForTalkUser.findAll({
      where: { is_active: true, is_verified: true },
      attributes: existingColumns,
      order: [['created_at', 'ASC']]
    });

    // Format participants data
    const formattedParticipants = participants.map(participant => {
      const formattedInterests = (() => {
        try {
          // Handle different formats from database
          if (Array.isArray(participant.interests)) {
            return participant.interests;
          } else if (typeof participant.interests === 'string') {
            // Try JSON.parse first
            try {
              return JSON.parse(participant.interests);
            } catch (jsonError) {
              // If JSON.parse fails, it might be comma-separated string
              return participant.interests.split(',').map(item => item.trim());
            }
          }
          return [];
        } catch (e) {
          return [];
        }
      })();
      
      return {
        id: participant.id,
        firstName: participant.first_name,
        lastName: participant.last_name,
        nickname: participant.nickname,
        gender: participant.gender,
        age: participant.age,
        bio: participant.bio,
        interests: formattedInterests,
        profilePhotoUrl: participant.profile_photo_url,
        attractiveTraitsOther: participant.attractive_traits_other
      };
    });

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

    // Describe table to safely include optional columns (prod-safe)
    const columns = await require('../config/database').getQueryInterface().describeTable('food_for_talk_users');
    const existingColumns = Object.keys(columns);

    // Build attributes, prefer minimal fields to avoid exposing personal info
    const baseAttrs = ['id', 'first_name', 'last_name', 'profile_photo_url'];
    if (existingColumns.includes('nickname')) baseAttrs.push('nickname');

    const participants = await FoodForTalkUser.findAll({
      where: { is_active: true, is_verified: true },
      attributes: baseAttrs,
      order: [['created_at', 'ASC']]
    });

    // Format participants with nickname-only display for chat
    const participantsWithBlurredNames = participants.map(participant => {
      const hasNickname = 'nickname' in participant && participant.nickname && participant.nickname.trim().length > 0;
      const displayName = hasNickname
        ? participant.nickname.trim()
        : (participant.first_name ? participant.first_name.charAt(0) + '***' : 'Anonymous');
      return {
        id: participant.id,
        blurredName: displayName,
        profilePhotoUrl: participant.profile_photo_url
      };
    });

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
