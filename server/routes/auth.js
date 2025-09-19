const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const { User, Agent } = require('../models');
const { Op } = require('sequelize');

// Login
router.post('/login', authController.login);

// Simple login test endpoint
router.post('/login-test', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { sequelize } = require('../models');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    
    console.log('🔍 Testing login for:', email);
    
    // Use raw SQL to find user
    const [users] = await sequelize.query(`
      SELECT id, email, password_hash, first_name, last_name, role, points, subscription_status
      FROM users 
      WHERE email = :email
    `, {
      replacements: { email },
      type: sequelize.QueryTypes.SELECT
    });
    
    if (users.length === 0) {
      return res.json({
        success: false,
        error: 'User not found',
        email: email
      });
    }
    
    const user = users[0];
    console.log('👤 Found user:', user.email, user.role);
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔐 Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.json({
        success: false,
        error: 'Invalid password',
        email: email
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        points: user.points,
        subscription_status: user.subscription_status
      }
    });
    
  } catch (error) {
    console.error('Login test error:', error);
    res.status(500).json({
      success: false,
      error: 'Login test failed: ' + error.message
    });
  }
});

// Register
router.post('/register', authController.register);

// Get current user
router.get('/me', authenticateToken, authController.getCurrentUser);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

// Google OAuth Routes (only if credentials are available)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  router.get('/google/callback', 
    passport.authenticate('google', { session: false }),
    async (req, res) => {
    try {
      console.log('Google OAuth callback - User:', req.user);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user.id, role: req.user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=google`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }
  }
  );
}

// Facebook OAuth Routes (only if credentials are available)
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  router.get('/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    async (req, res) => {
    try {
      console.log('Facebook OAuth callback - User:', req.user);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user.id, role: req.user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=facebook`);
    } catch (error) {
      console.error('Facebook OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }
  }
  );
}

// Get all users for quick login - Simplified and Robust
router.get('/quick-login-users', async (req, res) => {
  try {
    console.log('🔍 Quick login API called');
    
    // Get all active users (exclude soft-deleted)
    const users = await User.findAll({
      where: {
        email: {
          [Op.notLike]: 'deleted_%'
        }
      },
      attributes: ['id', 'email', 'first_name', 'last_name', 'role'],
      order: [['role', 'ASC'], ['first_name', 'ASC']],
      raw: false
    });
    
    console.log(`📊 Quick login found ${users.length} users`);
    
    // Group users by role
    const usersByRole = {
      super_admin: [],
      admin: [],
      agent: [],
      client: []
    };
    
    users.forEach(user => {
      if (usersByRole[user.role]) {
        usersByRole[user.role].push(user);
      }
    });
    
    console.log('📈 Quick login users by role:', {
      super_admin: usersByRole.super_admin.length,
      admin: usersByRole.admin.length,
      agent: usersByRole.agent.length,
      client: usersByRole.client.length
    });
    
    res.json({
      success: true,
      users: usersByRole,
      total: users.length
    });
  } catch (error) {
    console.error('❌ Get quick login users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    });
  }
});

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
    // First, try to fix the database schema
    try {
      const { sequelize } = require('../models');
      
      // Add missing columns if they don't exist
      try {
        await sequelize.query(`
          ALTER TABLE users ADD COLUMN permissions JSONB DEFAULT '{}';
        `);
        console.log('✅ Added permissions column');
      } catch (error) {
        if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
          console.log('✅ Permissions column already exists');
        }
      }
      
      try {
        await sequelize.query(`
          ALTER TABLE users ADD COLUMN created_by_super_admin UUID REFERENCES users(id);
        `);
        console.log('✅ Added created_by_super_admin column');
      } catch (error) {
        if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
          console.log('✅ created_by_super_admin column already exists');
        }
      }
      
      try {
        await sequelize.query(`
          ALTER TABLE users ADD COLUMN is_system_admin BOOLEAN DEFAULT FALSE;
        `);
        console.log('✅ Added is_system_admin column');
      } catch (error) {
        if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
          console.log('✅ is_system_admin column already exists');
        }
      }
    } catch (schemaError) {
      console.log('Schema fix failed, continuing with user creation:', schemaError.message);
    }

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
    const bcrypt = require('bcryptjs');
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
        receivedEmail: email,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    res.json({
      success: true,
      message: 'Debug endpoint working',
      receivedEmail: email,
      receivedPassword: password ? '***' : 'not provided',
      userFound: true,
      passwordValid: isValidPassword,
      userRole: user.role,
      passwordHash: user.password_hash,
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
    
    // Get database info
    const sequelize = require('../config/database');
    const dbInfo = {
      dialect: sequelize.getDialect(),
      host: sequelize.config.host,
      database: sequelize.config.database,
      username: sequelize.config.username,
      port: sequelize.config.port,
      ssl: sequelize.config.dialectOptions?.ssl
    };
    
    // Get table schema
    let schema;
    if (sequelize.getDialect() === 'postgres') {
      [schema] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
    } else {
      [schema] = await sequelize.query(`
        PRAGMA table_info(users);
      `);
    }
    
    // Get all users with raw query
    let users;
    if (sequelize.getDialect() === 'postgres') {
      [users] = await sequelize.query(`
        SELECT id, email, role, is_system_admin, password_hash, is_verified, subscription_status, permissions
        FROM users;
      `);
    } else {
      [users] = await sequelize.query(`
        SELECT id, email, role, is_system_admin, password_hash, is_verified, subscription_status, permissions
        FROM users;
      `);
    }
    
    // Get environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not set',
      DB_URL: process.env.DB_URL ? 'set' : 'not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set'
    };
    
    // Test super admin login
    const bcrypt = require('bcryptjs');
    const superAdmin = users.find(u => u.role === 'super_admin');
    const testPassword = 'superadmin123';
    const isValidPassword = superAdmin ? await bcrypt.compare(testPassword, superAdmin.password_hash) : false;
    
    // Create super admin if not found
    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const newSuperAdmin = await User.create({
        email: 'superadmin@personacentric.com',
        password_hash: hashedPassword,
        first_name: 'Super',
        last_name: 'Admin',
        role: 'super_admin',
        is_verified: true,
        is_system_admin: true,
        subscription_status: 'active',
        permissions: {
          users: ['read', 'write', 'delete'],
          admins: ['read', 'write', 'delete'],
          points: ['read', 'write'],
          payments: ['read', 'write', 'refund']
        }
      });
      
      [users] = await sequelize.query(`
        SELECT id, email, role, is_system_admin, password_hash, is_verified, subscription_status, permissions
        FROM users;
      `);
      const createdSuperAdmin = users.find(u => u.role === 'super_admin');
      const isValidPasswordNow = await bcrypt.compare(testPassword, createdSuperAdmin.password_hash);
      
      // Test login with updated password
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: createdSuperAdmin.id, role: createdSuperAdmin.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        message: 'Database connection successful and super admin created',
        userCount: userCount + 1,
        users: users,
        dbInfo: dbInfo,
        schema: schema,
        envInfo: envInfo,
        superAdminTest: {
          found: true,
          passwordValid: isValidPasswordNow,
          isVerified: createdSuperAdmin?.is_verified,
          isSystemAdmin: createdSuperAdmin?.is_system_admin,
          subscriptionStatus: createdSuperAdmin?.subscription_status,
          permissions: createdSuperAdmin?.permissions,
          fixed: true,
          created: true,
          token: token
        },
        timestamp: new Date().toISOString()
      });
    }
    // Fix super admin if needed
    else if (!isValidPassword) {
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      if (sequelize.getDialect() === 'postgres') {
        await sequelize.query(`
          UPDATE users
          SET password_hash = :password,
              is_verified = true,
              is_system_admin = true,
              subscription_status = 'active',
              permissions = :permissions,
              last_login = NOW()
          WHERE role = 'super_admin'
          RETURNING id, email, role, is_system_admin, password_hash, is_verified, subscription_status, permissions;
        `, {
          replacements: {
            password: hashedPassword,
            permissions: JSON.stringify({
              users: ['read', 'write', 'delete'],
              admins: ['read', 'write', 'delete'],
              points: ['read', 'write'],
              payments: ['read', 'write', 'refund']
            })
          }
        });
      } else {
        await sequelize.query(`
          UPDATE users
          SET password_hash = ?,
              is_verified = 1,
              is_system_admin = 1,
              subscription_status = 'active',
              permissions = ?,
              last_login = CURRENT_TIMESTAMP
          WHERE role = 'super_admin';
        `, {
          replacements: [
            hashedPassword,
            JSON.stringify({
              users: ['read', 'write', 'delete'],
              admins: ['read', 'write', 'delete'],
              points: ['read', 'write'],
              payments: ['read', 'write', 'refund']
            })
          ]
        });
      }
      
      // Get updated super admin
      [users] = await sequelize.query(`
        SELECT id, email, role, is_system_admin, password_hash, is_verified, subscription_status, permissions
        FROM users;
      `);
      const updatedSuperAdmin = users.find(u => u.role === 'super_admin');
      const isValidPasswordNow = await bcrypt.compare(testPassword, updatedSuperAdmin.password_hash);
      
      // Test login with updated password
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: updatedSuperAdmin.id, role: updatedSuperAdmin.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        message: 'Database connection successful and super admin fixed',
        userCount: userCount,
        users: users,
        dbInfo: dbInfo,
        schema: schema,
        envInfo: envInfo,
        superAdminTest: {
          found: !!updatedSuperAdmin,
          passwordValid: isValidPasswordNow,
          isVerified: updatedSuperAdmin?.is_verified,
          isSystemAdmin: updatedSuperAdmin?.is_system_admin,
          subscriptionStatus: updatedSuperAdmin?.subscription_status,
          permissions: updatedSuperAdmin?.permissions,
          fixed: true,
          token: token
        },
        timestamp: new Date().toISOString()
      });
    } else {
      // Test login with valid password
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: superAdmin.id, role: superAdmin.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      // Update last login
      if (sequelize.getDialect() === 'postgres') {
        await sequelize.query(`
          UPDATE users
          SET last_login = NOW()
          WHERE role = 'super_admin';
        `);
      } else {
        await sequelize.query(`
          UPDATE users
          SET last_login = CURRENT_TIMESTAMP
          WHERE role = 'super_admin';
        `);
      }
      
      res.json({
        success: true,
        message: 'Database connection successful',
        userCount: userCount,
        users: users,
        dbInfo: dbInfo,
        schema: schema,
        envInfo: envInfo,
        superAdminTest: {
          found: !!superAdmin,
          passwordValid: isValidPassword,
          isVerified: superAdmin?.is_verified,
          isSystemAdmin: superAdmin?.is_system_admin,
          subscriptionStatus: superAdmin?.subscription_status,
          permissions: superAdmin?.permissions,
          fixed: false,
          token: token
        },
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed: ' + error.message
    });
  }
});

// Fix database endpoint
router.post('/fix-db', async (req, res) => {
  try {
    const { User } = require('../models');
    const bcrypt = require('bcryptjs');
    
    console.log('🔄 Fixing database...');
    
    // Find super admin
    const superAdmin = await User.findOne({
      where: { role: 'super_admin' }
    });
    
    if (!superAdmin) {
      return res.json({
        success: false,
        message: 'Super admin not found',
        timestamp: new Date().toISOString()
      });
    }
    
    // Update password
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    await User.update(
      {
        password_hash: hashedPassword,
        is_verified: true,
        is_system_admin: true,
        subscription_status: 'active',
        permissions: {
          users: ['read', 'write', 'delete'],
          admins: ['read', 'write', 'delete'],
          points: ['read', 'write'],
          payments: ['read', 'write', 'refund']
        }
      },
      { where: { role: 'super_admin' } }
    );
    
    res.json({
      success: true,
      message: 'Database fixed successfully',
      user: {
        id: superAdmin.id,
        email: superAdmin.email,
        role: superAdmin.role
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Fix database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fix database: ' + error.message
    });
  }
});

// Fix super admin password endpoint
router.post('/fix-super-admin-password', async (req, res) => {
  try {
    const { User } = require('../models');
    const bcrypt = require('bcryptjs');
    
    // Find super admin
    const superAdmin = await User.findOne({
      where: { role: 'super_admin' }
    });
    
    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        error: 'Super admin not found'
      });
    }
    
    // Update password
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    await superAdmin.update({
      password_hash: hashedPassword
    });
    
    res.json({
      success: true,
      message: 'Super admin password fixed successfully',
      user: {
        email: superAdmin.email,
        role: superAdmin.role
      }
    });
  } catch (error) {
    console.error('Fix super admin password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fix super admin password: ' + error.message
    });
  }
});

// Initialize super admin endpoint
router.post('/init-super-admin', async (req, res) => {
  try {
    const { User } = require('../models');
    const bcrypt = require('bcryptjs');
    
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({
      where: { role: 'super_admin' }
    });
    
    if (existingSuperAdmin) {
      return res.json({
        success: true,
        message: 'Super admin already exists',
        user: {
          email: existingSuperAdmin.email,
          role: existingSuperAdmin.role
        }
      });
    }
    
    // Create super admin user
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    const superAdmin = await User.create({
      email: 'superadmin@personacentric.com',
      password_hash: hashedPassword,
      first_name: 'Super',
      last_name: 'Admin',
      role: 'super_admin',
      is_verified: true,
      is_system_admin: true,
      subscription_status: 'active',
      permissions: {
        users: ['read', 'write', 'delete'],
        admins: ['read', 'write', 'delete'],
        points: ['read', 'write'],
        payments: ['read', 'write', 'refund']
      }
    });
    
    res.json({
      success: true,
      message: 'Super admin created successfully',
      user: {
        email: superAdmin.email,
        role: superAdmin.role
      }
    });
  } catch (error) {
    console.error('Init super admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize super admin: ' + error.message
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

// Raw SQL login test endpoint
router.post('/raw-login-test', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { sequelize } = require('../models');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    
    console.log('🔍 Testing raw SQL login for:', email);
    
    // Use raw SQL to find user
    const [users] = await sequelize.query(`
      SELECT id, email, password_hash, first_name, last_name, role, points, subscription_status, is_verified, is_system_admin, permissions
      FROM users 
      WHERE email = :email
    `, {
      replacements: { email },
      type: sequelize.QueryTypes.SELECT
    });
    
    if (users.length === 0) {
      return res.json({
        success: false,
        error: 'User not found',
        email: email
      });
    }
    
    const user = users[0];
    console.log('👤 Found user:', user.email, user.role);
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔐 Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.json({
        success: false,
        error: 'Invalid password',
        email: email
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Update last login
    await sequelize.query(`
      UPDATE users SET last_login = NOW() WHERE id = :userId
    `, {
      replacements: { userId: user.id }
    });
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        points: user.points,
        subscription_status: user.subscription_status
      }
    });
    
  } catch (error) {
    console.error('Raw login test error:', error);
    res.status(500).json({
      success: false,
      error: 'Raw login test failed: ' + error.message
    });
  }
});

// Create super admin endpoint
router.post('/create-super-admin', async (req, res) => {
  try {
    const { User } = require('../models');
    const bcrypt = require('bcryptjs');
    
    console.log('🔄 Creating super admin user...');
    
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({
      where: { role: 'super_admin' }
    });
    
    if (existingSuperAdmin) {
      return res.json({
        success: true,
        message: 'Super admin already exists',
        user: {
          email: existingSuperAdmin.email,
          role: existingSuperAdmin.role
        }
      });
    }
    
    // Create super admin user
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    const superAdmin = await User.create({
      email: 'superadmin@personacentric.com',
      password_hash: hashedPassword,
      first_name: 'Super',
      last_name: 'Admin',
      role: 'super_admin',
      is_verified: true,
      is_system_admin: true,
      subscription_status: 'active',
      permissions: {
        users: ['read', 'write', 'delete'],
        admins: ['read', 'write', 'delete'],
        points: ['read', 'write'],
        payments: ['read', 'write', 'refund']
      }
    });
    
    res.json({
      success: true,
      message: 'Super admin created successfully',
      user: {
        email: superAdmin.email,
        role: superAdmin.role
      }
    });
  } catch (error) {
    console.error('Create super admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create super admin: ' + error.message
    });
  }
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

// Fix production database schema endpoint
router.post('/fix-production-schema', async (req, res) => {
  try {
    const { sequelize } = require('../models');
    
    console.log('🔄 Fixing production database schema...');
    
    // Add missing columns if they don't exist
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN permissions JSONB DEFAULT '{}';
      `);
      console.log('✅ Added permissions column');
    } catch (error) {
      if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
        console.log('✅ Permissions column already exists');
      } else {
        console.error('❌ Error adding permissions column:', error.message);
      }
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN created_by_super_admin UUID REFERENCES users(id);
      `);
      console.log('✅ Added created_by_super_admin column');
    } catch (error) {
      if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
        console.log('✅ created_by_super_admin column already exists');
      } else {
        console.error('❌ Error adding created_by_super_admin column:', error.message);
      }
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN is_system_admin BOOLEAN DEFAULT FALSE;
      `);
      console.log('✅ Added is_system_admin column');
    } catch (error) {
      if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
        console.log('✅ is_system_admin column already exists');
      } else {
        console.error('❌ Error adding is_system_admin column:', error.message);
      }
    }
    
    res.json({
      success: true,
      message: 'Production database schema fixed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Schema fix error:', error);
    res.status(500).json({
      success: false,
      error: 'Schema fix failed: ' + error.message
    });
  }
});

// Simple schema fix endpoint
router.post('/fix-schema', async (req, res) => {
  try {
    const { sequelize } = require('../models');
    
    console.log('🔄 Fixing database schema...');
    
    // Add missing columns if they don't exist
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN permissions JSONB DEFAULT '{}';
      `);
      console.log('✅ Added permissions column');
    } catch (error) {
      if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
        console.log('✅ Permissions column already exists');
      } else {
        console.error('❌ Error adding permissions column:', error.message);
      }
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN created_by_super_admin UUID REFERENCES users(id);
      `);
      console.log('✅ Added created_by_super_admin column');
    } catch (error) {
      if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
        console.log('✅ created_by_super_admin column already exists');
      } else {
        console.error('❌ Error adding created_by_super_admin column:', error.message);
      }
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN is_system_admin BOOLEAN DEFAULT FALSE;
      `);
      console.log('✅ Added is_system_admin column');
    } catch (error) {
      if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
        console.log('✅ is_system_admin column already exists');
      } else {
        console.error('❌ Error adding is_system_admin column:', error.message);
      }
    }
    
    // Add OAuth columns
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN google_id VARCHAR(255);
      `);
      console.log('✅ Added google_id column');
    } catch (error) {
      if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
        console.log('✅ google_id column already exists');
      } else {
        console.error('❌ Error adding google_id column:', error.message);
      }
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN facebook_id VARCHAR(255);
      `);
      console.log('✅ Added facebook_id column');
    } catch (error) {
      if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
        console.log('✅ facebook_id column already exists');
      } else {
        console.error('❌ Error adding facebook_id column:', error.message);
      }
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN provider VARCHAR(50) DEFAULT 'local' NOT NULL;
      `);
      console.log('✅ Added provider column');
    } catch (error) {
      if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
        console.log('✅ provider column already exists');
      } else {
        console.error('❌ Error adding provider column:', error.message);
      }
    }
    
    res.json({
      success: true,
      message: 'Database schema fixed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Schema fix error:', error);
    res.status(500).json({
      success: false,
      error: 'Schema fix failed: ' + error.message
    });
  }
});

// Add missing OAuth columns endpoint
router.post('/add-oauth-columns', async (req, res) => {
  try {
    const { sequelize } = require('../models');
    
    console.log('🔄 Adding OAuth columns to users table...');
    
    // Add google_id column
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
      `);
      console.log('✅ Added google_id column');
    } catch (error) {
      console.error('❌ Error adding google_id column:', error.message);
    }
    
    // Add facebook_id column
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS facebook_id VARCHAR(255);
      `);
      console.log('✅ Added facebook_id column');
    } catch (error) {
      console.error('❌ Error adding facebook_id column:', error.message);
    }
    
    // Add provider column
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'local';
      `);
      console.log('✅ Added provider column');
    } catch (error) {
      console.error('❌ Error adding provider column:', error.message);
    }
    
    // Update existing users to have provider = 'local'
    try {
      await sequelize.query(`
        UPDATE users SET provider = 'local' WHERE provider IS NULL;
      `);
      console.log('✅ Updated existing users with provider = local');
    } catch (error) {
      console.error('❌ Error updating existing users:', error.message);
    }
    
    res.json({
      success: true,
      message: 'OAuth columns added successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Add OAuth columns error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add OAuth columns: ' + error.message
    });
  }
});

// Temporary endpoint to create all missing users to match seed data
router.post('/create-all-missing-users', async (req, res) => {
  try {
    const createAllMissingUsers = require('../createAllMissingUsers');
    await createAllMissingUsers();
    
    res.json({
      success: true,
      message: 'All missing users created successfully to match seed data',
      note: 'This ensures the login page users match the actual database users'
    });
  } catch (error) {
    console.error('Create all missing users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create missing users: ' + error.message
    });
  }
});

module.exports = router; 