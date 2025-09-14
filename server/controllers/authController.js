const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');

class AuthController {
  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Update last login
      await user.update({ last_login: new Date() });

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
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Register user
  async register(req, res) {
    try {
      const { email, password, first_name, last_name, role = 'client' } = req.body;

      // Validate input
      if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists'
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        email,
        password_hash: passwordHash,
        first_name,
        last_name,
        role,
        subscription_status: 'inactive'
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
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
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
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
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Forgot password - send reset email
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      const user = await User.findOne({ where: { email } });
      
      if (user) {
        // User exists - generate reset token and send email
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        await user.update({
          reset_password_token: resetToken,
          reset_password_expires: resetExpires
        });

        // Send email
        try {
          const emailService = require('../services/emailService');
          await emailService.sendPasswordResetEmail(user.email, resetToken);
          console.log(`Password reset email sent to ${user.email}`);
        } catch (emailError) {
          console.error('Failed to send reset email:', emailError);
          return res.status(500).json({
            success: false,
            error: 'Failed to send reset email. Please try again later.'
          });
        }

        res.json({ 
          success: true, 
          message: 'Password reset instructions have been sent to your email address.',
          emailExists: true
        });
      } else {
        // User doesn't exist - tell them and suggest registration
        res.json({ 
          success: false, 
          error: 'No account found with this email address.',
          emailExists: false,
          suggestion: 'Would you like to create a new account?'
        });
      }

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Reset password with token
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Token and new password are required'
        });
      }

      // Validate password length
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long'
        });
      }

      const user = await User.findOne({
        where: {
          reset_password_token: token,
          reset_password_expires: { [Op.gt]: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token'
        });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);
      
      // Update password and clear reset token
      await user.update({
        password_hash: passwordHash,
        reset_password_token: null,
        reset_password_expires: null
      });

      res.json({ 
        success: true, 
        message: 'Password has been reset successfully'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

module.exports = new AuthController(); 