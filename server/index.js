const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import configurations
const sequelize = require('./config/database');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

// Import routes
const routes = require('./routes');

// Import utilities
const ServerStartup = require('./utils/serverStartup');

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

// API Routes - MUST come before the catch-all route
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
// This MUST come after all API routes
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  const indexPath = path.join(buildPath, 'index.html');
  
  // Check if build directory exists before serving static files
  if (require('fs').existsSync(buildPath) && require('fs').existsSync(indexPath)) {
    app.use(express.static(buildPath));
    
    // Catch-all route for React app - MUST be last
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
  try {
    const serverStartup = new ServerStartup(app);
    await serverStartup.start(PORT);
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}



startServer();

module.exports = app;// Force deployment update
