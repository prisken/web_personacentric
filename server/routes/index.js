const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const adminRoutes = require('./admin');
const superAdminRoutes = require('./superAdmin');
const agentRoutes = require('./agents');
const eventRoutes = require('./events');
const blogRoutes = require('./blogs');
const giftRoutes = require('./gifts');
const paymentRoutes = require('./payments');
const uploadRoutes = require('./upload');
const aiRoutes = require('./ai');
const contestRoutes = require('./contests');
const quizRoutes = require('./quizzes');
const clientManagementRoutes = require('./clientManagement');
const externalQuizRoutes = require('./external-quiz');
const dashboardRoutes = require('./dashboard');
const foodForTalkRoutes = require('./foodForTalk');
const foodForTalkAdminRoutes = require('./foodForTalkAdmin');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/super-admin', superAdminRoutes);
router.use('/agents', agentRoutes);
router.use('/events', eventRoutes);
router.use('/blogs', blogRoutes);
router.use('/gifts', giftRoutes);
router.use('/payments', paymentRoutes);
router.use('/upload', uploadRoutes);
router.use('/ai', aiRoutes);
router.use('/contests', contestRoutes);
router.use('/quizzes', quizRoutes);
router.use('/client-management', clientManagementRoutes);
router.use('/external-quiz', externalQuizRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/food-for-talk', foodForTalkRoutes);
router.use('/food-for-talk/admin', foodForTalkAdminRoutes);

module.exports = router; 