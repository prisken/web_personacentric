const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import configurations
const sequelize = require('./config/database');
const { runMigrations } = require('./utils/databaseMigration');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

// Import routes
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CORS_ORIGIN || 'https://web-personacentric.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Serve React app in production (only if build directory exists)
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  const indexPath = path.join(buildPath, 'index.html');
  
  // Check if build directory exists before serving static files
  if (require('fs').existsSync(buildPath) && require('fs').existsSync(indexPath)) {
    app.use(express.static(buildPath));
    
    app.get('*', (req, res) => {
      res.sendFile(indexPath);
    });
  } else {
    console.log('⚠️ Frontend build not found, serving API only');
  }
}

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection and server start
async function startServer() {
  let server;
  
  try {
    console.log('🚀 Starting server...');
    console.log('📊 Environment:', process.env.NODE_ENV || 'development');
    
    // Connect to database
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Fix database schema if needed (production only)
    if (process.env.NODE_ENV === 'production') {
      console.log('🔧 Checking and fixing production database schema...');
      try {
        // Check if client_id column exists
        const [results] = await sequelize.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'client_id'
        `);
        
        if (results.length === 0) {
          console.log('⚠️ client_id column missing, adding it...');
          await sequelize.query(`
            ALTER TABLE users 
            ADD COLUMN client_id VARCHAR(10)
          `);
          console.log('✅ client_id column added successfully');
        } else {
          console.log('✅ client_id column already exists');
        }
        
        // Check for other missing columns
        const requiredColumns = [
          'subscription_end_date',
          'grace_period_end_date',
          'verification_token',
          'reset_password_token',
          'reset_password_expires'
        ];
        
        for (const column of requiredColumns) {
          const [columnCheck] = await sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = '${column}'
          `);
          
          if (columnCheck.length === 0) {
            console.log(`⚠️ ${column} column missing, adding it...`);
            let columnType = 'VARCHAR(255)';
            if (column.includes('_date') || column.includes('_expires')) {
              columnType = 'TIMESTAMP';
            }
            await sequelize.query(`
              ALTER TABLE users 
              ADD COLUMN ${column} ${columnType}
            `);
            console.log(`✅ ${column} column added successfully`);
          }
        }
        
        console.log('🎉 Production database schema fix completed');
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

    // Start server
    server = app.listen(PORT, () => {
      console.log(`🎉 Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => handleShutdown(server));
    process.on('SIGINT', () => handleShutdown(server));

    // Check database state and seed if needed
    await checkAndSeedDatabase();

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    if (server) server.close();
    process.exit(1);
  }
}

// Check database state and seed if needed
async function checkAndSeedDatabase() {
  try {
    const { User, Event, Gift } = require('./models');
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
      const seedData = require('./seedData');
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

// Graceful shutdown handler
async function handleShutdown(server) {
  console.log('🛑 Received shutdown signal');
  
  // Close server first to stop accepting new connections
  server.close(() => {
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
}

startServer();

module.exports = app;// Force deployment update
