const path = require('path');
const fs = require('fs');
const express = require('express');
const sequelize = require('../config/database');
const { runMigrations } = require('./databaseMigration');
const DatabaseFixer = require('./databaseFixer');

/**
 * Server Startup Utility
 * Handles server initialization, database setup, and graceful shutdown
 */
class ServerStartup {
  constructor(app) {
    this.app = app;
    this.server = null;
    this.databaseFixer = new DatabaseFixer();
  }

  /**
   * Initialize database connection and schema
   */
  async initializeDatabase() {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Fix database schema if needed (production only)
    if (process.env.NODE_ENV === 'production') {
      console.log('🔧 Checking and fixing production database schema...');
      try {
        await this.databaseFixer.fixAll();
        console.log('✅ Production database schema fix completed');
      } catch (error) {
        console.log('⚠️ Database schema fix failed, continuing with existing schema:', error.message);
      }
    }

    // Sync database (create tables if they don't exist)
    console.log('🔄 Syncing database...');
    try {
      // Disable foreign key constraints temporarily for SQLite
      if (sequelize.getDialect() === 'sqlite') {
        await sequelize.query('PRAGMA foreign_keys = OFF;');
      }
      await sequelize.sync({ force: false, alter: false });
      if (sequelize.getDialect() === 'sqlite') {
        await sequelize.query('PRAGMA foreign_keys = ON;');
      }
      console.log('✅ Database synced successfully');
    } catch (error) {
      console.log('⚠️ Database sync failed, continuing with existing schema:', error.message);
    }

    // Run migrations
    console.log('📦 Running migrations...');
    await runMigrations();
    console.log('✅ Migrations completed');
  }

  /**
   * Setup static file serving for production
   */
  setupStaticFiles() {
    if (process.env.NODE_ENV === 'production') {
      const buildPath = path.join(__dirname, '../../client/build');
      const indexPath = path.join(buildPath, 'index.html');
      
      // Check if build directory exists before serving static files
      if (fs.existsSync(buildPath) && fs.existsSync(indexPath)) {
        this.app.use(express.static(buildPath));
        
        this.app.get('*', (req, res) => {
          res.sendFile(indexPath);
        });
        console.log('✅ Static files configured for production');
      } else {
        console.log('⚠️ Frontend build not found, serving API only');
      }
    }
  }

  /**
   * Check database state and seed if needed
   */
  async checkAndSeedDatabase() {
    try {
      const { User, Event, Gift } = require('../models');
      const [userCount, eventCount, giftCount] = await Promise.all([
        User.count(),
        Event.count(),
        Gift.count()
      ]);
      
      console.log('📊 Current database state:', {
        users: userCount,
        events: eventCount,
        gifts: giftCount
      });

      // Seed data if needed
      if (eventCount === 0 || giftCount === 0) {
        console.log('🌱 Missing data, running seed script...');
        const seedData = require('../seedData');
        try {
          await seedData();
          console.log('✅ Seed data created successfully');
        } catch (error) {
          console.error('❌ Error seeding data:', error);
          // Don't exit on seeding error in production
          if (process.env.NODE_ENV !== 'production') {
            throw error;
          }
        }
      } else {
        console.log('✅ Data already exists, skipping seed script');
      }
    } catch (error) {
      console.error('❌ Error checking database state:', error);
      if (process.env.NODE_ENV !== 'production') {
        throw error;
      }
    }
  }

  /**
   * Setup graceful shutdown handlers
   */
  setupGracefulShutdown() {
    process.on('SIGTERM', () => this.handleShutdown());
    process.on('SIGINT', () => this.handleShutdown());
  }

  /**
   * Handle graceful shutdown
   */
  async handleShutdown() {
    console.log('🛑 Received shutdown signal');
    
    if (this.server) {
      // Close server first to stop accepting new connections
      this.server.close(() => {
        console.log('🔒 Server closed');
        
        // Then close database connection
        sequelize.close().then(() => {
          console.log('🔌 Database connection closed');
          process.exit(0);
        }).catch((err) => {
          console.error('❌ Error closing database connection:', err);
          process.exit(1);
        });
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('⏰ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    } else {
      process.exit(0);
    }
  }

  /**
   * Start the server
   */
  async start(port) {
    try {
      console.log('🚀 Starting server...');
      console.log('📊 Environment:', process.env.NODE_ENV || 'development');
      
      // Initialize database
      await this.initializeDatabase();
      
      // Setup static files for production
      this.setupStaticFiles();
      
      // Setup graceful shutdown
      this.setupGracefulShutdown();
      
      // Start server
      this.server = this.app.listen(port, () => {
        console.log(`🎉 Server running on port ${port}`);
        console.log(`🌐 Health check: http://localhost:${port}/api/health`);
      });

      // Check database state and seed if needed
      await this.checkAndSeedDatabase();

    } catch (error) {
      console.error('❌ Unable to start server:', error);
      if (this.server) this.server.close();
      process.exit(1);
    }
  }
}

module.exports = ServerStartup; 