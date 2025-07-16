const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { User, Agent } = require('../models');

// Login
router.post('/login', authController.login);

// Register
router.post('/register', authController.register);

// Get current user
router.get('/me', authenticateToken, authController.getCurrentUser);

// Temporary endpoint to create admin user (remove in production)
router.post('/create-admin', async (req, res) => {
  try {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@personacentric.com',
      password_hash: adminPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      subscription_status: 'active',
      is_verified: true
    });
    
    res.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create admin user'
    });
  }
});

// Temporary endpoint to create agent users (remove in production)
router.post('/create-agents', async (req, res) => {
  try {
    const agent1Password = await bcrypt.hash('agent123', 10);
    const agent1 = await User.create({
      email: 'agent1@personacentric.com',
      password_hash: agent1Password,
      first_name: '張',
      last_name: '顧問',
      role: 'agent',
      subscription_status: 'active',
      is_verified: true
    });

    const agent2Password = await bcrypt.hash('agent123', 10);
    const agent2 = await User.create({
      email: 'agent2@personacentric.com',
      password_hash: agent2Password,
      first_name: '李',
      last_name: '顧問',
      role: 'agent',
      subscription_status: 'active',
      is_verified: true
    });

    // Create agent profiles
    const agent1Profile = await Agent.create({
      user_id: agent1.id,
      specialization: '投資規劃',
      experience_years: 5,
      certifications: 'CFP, CFA',
      bio: '專注於個人投資規劃和退休規劃',
      commission_rate: 0.15,
      is_verified: true
    });

    const agent2Profile = await Agent.create({
      user_id: agent2.id,
      specialization: '保險規劃',
      experience_years: 8,
      certifications: 'CFP, CLU',
      bio: '專業保險顧問，提供全面的保險解決方案',
      commission_rate: 0.12,
      is_verified: true
    });
    
    res.json({
      success: true,
      message: 'Agent users created successfully',
      agents: [
        {
          id: agent1.id,
          email: agent1.email,
          role: agent1.role,
          profile_id: agent1Profile.id
        },
        {
          id: agent2.id,
          email: agent2.email,
          role: agent2.role,
          profile_id: agent2Profile.id
        }
      ]
    });
  } catch (error) {
    console.error('Create agents error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create agent users'
    });
  }
});

// Temporary endpoint to create client users (remove in production)
router.post('/create-clients', async (req, res) => {
  try {
    const client1Password = await bcrypt.hash('client123', 10);
    const client1 = await User.create({
      email: 'client1@personacentric.com',
      password_hash: client1Password,
      first_name: '王',
      last_name: '客戶',
      role: 'client',
      subscription_status: 'active',
      is_verified: true
    });

    const client2Password = await bcrypt.hash('client123', 10);
    const client2 = await User.create({
      email: 'client2@personacentric.com',
      password_hash: client2Password,
      first_name: '陳',
      last_name: '客戶',
      role: 'client',
      subscription_status: 'active',
      is_verified: true
    });
    
    res.json({
      success: true,
      message: 'Client users created successfully',
      clients: [
        {
          id: client1.id,
          email: client1.email,
          role: client1.role
        },
        {
          id: client2.id,
          email: client2.email,
          role: client2.role
        }
      ]
    });
  } catch (error) {
    console.error('Create clients error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create client users'
    });
  }
});

// Temporary endpoint to create all seed users (remove in production)
router.post('/create-all-users', async (req, res) => {
  try {
    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@personacentric.com',
      password_hash: adminPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      subscription_status: 'active',
      is_verified: true
    });

    // Create agents
    const agent1Password = await bcrypt.hash('agent123', 10);
    const agent1 = await User.create({
      email: 'agent1@personacentric.com',
      password_hash: agent1Password,
      first_name: '張',
      last_name: '顧問',
      role: 'agent',
      subscription_status: 'active',
      is_verified: true
    });

    const agent2Password = await bcrypt.hash('agent123', 10);
    const agent2 = await User.create({
      email: 'agent2@personacentric.com',
      password_hash: agent2Password,
      first_name: '李',
      last_name: '顧問',
      role: 'agent',
      subscription_status: 'active',
      is_verified: true
    });

    // Create clients
    const client1Password = await bcrypt.hash('client123', 10);
    const client1 = await User.create({
      email: 'client1@personacentric.com',
      password_hash: client1Password,
      first_name: '王',
      last_name: '客戶',
      role: 'client',
      subscription_status: 'active',
      is_verified: true
    });

    const client2Password = await bcrypt.hash('client123', 10);
    const client2 = await User.create({
      email: 'client2@personacentric.com',
      password_hash: client2Password,
      first_name: '陳',
      last_name: '客戶',
      role: 'client',
      subscription_status: 'active',
      is_verified: true
    });

    // Create agent profiles
    const agent1Profile = await Agent.create({
      user_id: agent1.id,
      specialization: '投資規劃',
      experience_years: 5,
      certifications: 'CFP, CFA',
      bio: '專注於個人投資規劃和退休規劃',
      commission_rate: 0.15,
      is_verified: true
    });

    const agent2Profile = await Agent.create({
      user_id: agent2.id,
      specialization: '保險規劃',
      experience_years: 8,
      certifications: 'CFP, CLU',
      bio: '專業保險顧問，提供全面的保險解決方案',
      commission_rate: 0.12,
      is_verified: true
    });
    
    res.json({
      success: true,
      message: 'All seed users created successfully',
      users: {
        admin: {
          email: 'admin@personacentric.com',
          password: 'admin123',
          role: 'admin'
        },
        agents: [
          {
            email: 'agent1@personacentric.com',
            password: 'agent123',
            role: 'agent'
          },
          {
            email: 'agent2@personacentric.com',
            password: 'agent123',
            role: 'agent'
          }
        ],
        clients: [
          {
            email: 'client1@personacentric.com',
            password: 'client123',
            role: 'client'
          },
          {
            email: 'client2@personacentric.com',
            password: 'client123',
            role: 'client'
          }
        ]
      }
    });
  } catch (error) {
    console.error('Create all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create seed users'
    });
  }
});

module.exports = router; 