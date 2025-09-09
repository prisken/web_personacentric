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

// Temporary endpoint to create all test users (remove in production)
router.post('/create-all-test-users', async (req, res) => {
  try {
    // Create admin user
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
    console.log('Admin user created successfully');

    // Create agent1 user
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
    console.log('Agent1 user created successfully');

    // Create agent profile
    await Agent.create({
      user_id: agent1.id,
      specialization: '投資規劃',
      experience_years: 5,
      certifications: 'CFP, CFA',
      bio: '專注於個人投資規劃和退休規劃',
      commission_rate: 0.15,
      is_verified: true
    });
    console.log('Agent1 profile created successfully');

    // Create client1 user
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
    console.log('Client1 user created successfully');
    
    res.json({
      success: true,
      message: 'All test users created successfully',
      users: {
        admin: {
          email: 'admin@personacentric.com',
          password: 'admin123',
          role: 'admin'
        },
        agent: {
          email: 'agent1@personacentric.com',
          password: 'agent123',
          role: 'agent'
        },
        client: {
          email: 'client1@personacentric.com',
          password: 'client123',
          role: 'client'
        }
      }
    });
  } catch (error) {
    console.error('Create all test users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create test users: ' + error.message
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

// Temporary endpoint to create test users in production (remove in production)
router.post('/create-test-users', async (req, res) => {
  try {
    const createProductionUsers = require('../createProductionUsers');
    await createProductionUsers();
    
    res.json({
      success: true,
      message: 'Test users created successfully in production'
    });
  } catch (error) {
    console.error('Create test users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create test users: ' + error.message
    });
  }
});

// Debug login endpoint
router.post('/debug-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    res.json({
      success: true,
      message: 'Debug endpoint working',
      receivedEmail: email,
      receivedPassword: password ? '***' : 'not provided',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Debug login error:', error);
    res.status(500).json({
      success: false,
      error: 'Debug endpoint failed: ' + error.message
    });
  }
});

// Test database connection endpoint
router.get('/test-db', async (req, res) => {
  try {
    const { User } = require('../models');
    const userCount = await User.count();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      userCount: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed: ' + error.message
    });
  }
});

// Simple test endpoint without database
router.get('/simple-test', (req, res) => {
  res.json({
    success: true,
    message: 'Server is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test JWT configuration
router.get('/test-jwt', (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    // Test JWT signing
    const testToken = jwt.sign(
      { test: 'data' },
      secret,
      { expiresIn: '1h' }
    );
    
    res.json({
      success: true,
      message: 'JWT configuration working',
      hasSecret: !!process.env.JWT_SECRET,
      secretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      testToken: testToken.substring(0, 20) + '...',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('JWT test error:', error);
    res.status(500).json({
      success: false,
      error: 'JWT test failed: ' + error.message
    });
  }
});

// Check database schema endpoint
router.get('/check-schema', async (req, res) => {
  try {
    const { sequelize } = require('../models');
    
    // Check users table columns
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    res.json({
      success: true,
      message: 'Database schema check',
      tableName: 'users',
      columns: columns,
      hasClientId: columns.some(col => col.column_name === 'client_id'),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Schema check error:', error);
    res.status(500).json({
      success: false,
      error: 'Schema check failed: ' + error.message
    });
  }
});

// Run migrations endpoint (for production deployment)
router.post('/run-migrations', async (req, res) => {
  try {
    const MigrationRunner = require('../utils/runMigrations');
    const runner = new MigrationRunner();
    
    console.log('🔄 Running migrations on production...');
    await runner.runMigrations();
    await runner.close();
    
    res.json({
      success: true,
      message: 'Migrations completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      error: 'Migration failed: ' + error.message
    });
  }
});

module.exports = router; 