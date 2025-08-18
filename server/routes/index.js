const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const eventRoutes = require('./events');
const blogRoutes = require('./blogs');
const contestRoutes = require('./contests');
const aiRoutes = require('./ai');
const paymentRoutes = require('./payments');
const dashboardRoutes = require('./dashboard');
const adminRoutes = require('./admin');
const uploadRoutes = require('./upload');
const agentRoutes = require('./agents');
const giftRoutes = require('./gifts');
const quizRoutes = require('./quizzes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/blogs', blogRoutes);
router.use('/contests', contestRoutes);
router.use('/ai', aiRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/agents', agentRoutes);
router.use('/gifts', giftRoutes);
router.use('/quizzes', quizRoutes);

module.exports = router; 