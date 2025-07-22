const sequelize = require('../config/database');

// Import models
const User = require('./User');
const Agent = require('./Agent');
const Event = require('./Event');
const BlogPost = require('./BlogPost');
const BlogImage = require('./BlogImage');
const BlogCategory = require('./BlogCategory');
const BlogPostCategory = require('./BlogPostCategory');
const QuizQuestion = require('./QuizQuestion');
const QuizResponse = require('./QuizResponse');
const QuizSession = require('./QuizSession');
const Contest = require('./Contest');
const ContestSubmission = require('./ContestSubmission');
const PointTransaction = require('./PointTransaction');
const PaymentTransaction = require('./PaymentTransaction');
const Subscription = require('./Subscription');
const AccessCode = require('./AccessCode');
const Notification = require('./Notification');
const EventRegistration = require('./EventRegistration');
const AgentReview = require('./AgentReview');
const AgentClientRelationship = require('./AgentClientRelationship');
const ClientUpgrade = require('./ClientUpgrade');
// const Recommendation = require('./Recommendation');
// const RecommendationEngagement = require('./RecommendationEngagement');
// const Badge = require('./Badge');
// const UserBadge = require('./UserBadge');

// Define associations
// User associations
User.hasOne(Agent, { foreignKey: 'user_id', as: 'agent' });
User.hasMany(Event, { foreignKey: 'created_by', as: 'createdEvents' });
User.hasMany(BlogPost, { foreignKey: 'author_id', as: 'blogPosts' });
User.hasMany(Contest, { foreignKey: 'created_by', as: 'createdContests' });
User.hasMany(ContestSubmission, { foreignKey: 'user_id', as: 'contestSubmissions' });
User.hasMany(PointTransaction, { foreignKey: 'user_id', as: 'pointTransactions' });
User.hasMany(PaymentTransaction, { foreignKey: 'user_id', as: 'paymentTransactions' });
User.hasMany(Subscription, { foreignKey: 'user_id', as: 'subscriptions' });
User.hasMany(AccessCode, { foreignKey: 'user_id', as: 'accessCodes' });
User.hasMany(AccessCode, { foreignKey: 'created_by', as: 'createdAccessCodes' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
User.hasMany(EventRegistration, { foreignKey: 'user_id', as: 'eventRegistrations' });
User.hasMany(AgentReview, { foreignKey: 'reviewer_id', as: 'reviews' });
User.hasMany(AgentClientRelationship, { foreignKey: 'client_id', as: 'clientRelationships' });
User.hasMany(QuizResponse, { foreignKey: 'user_id', as: 'quizResponses' });
User.hasMany(QuizSession, { foreignKey: 'user_id', as: 'quizSessions' });
User.hasOne(ClientUpgrade, { foreignKey: 'user_id', as: 'upgradeApplication' });
// User.hasMany(Recommendation, { foreignKey: 'user_id', as: 'recommendations' });
// User.hasMany(UserBadge, { foreignKey: 'user_id', as: 'userBadges' });

// Agent associations
Agent.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Agent.hasMany(Event, { foreignKey: 'agent_id', as: 'events' });
Agent.hasMany(AgentReview, { foreignKey: 'agent_id', as: 'reviews' });
Agent.hasMany(AgentClientRelationship, { foreignKey: 'agent_id', as: 'clientRelationships' });

// Event associations
Event.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Event.belongsTo(Agent, { foreignKey: 'agent_id', as: 'agent' });
Event.hasMany(EventRegistration, { foreignKey: 'event_id', as: 'registrations' });

// Blog associations
BlogPost.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
BlogPost.hasMany(BlogImage, { foreignKey: 'blog_post_id', as: 'images' });
BlogPost.belongsToMany(BlogCategory, { 
  through: BlogPostCategory, 
  foreignKey: 'blog_post_id',
  otherKey: 'category_id',
  as: 'categories'
});

BlogImage.belongsTo(BlogPost, { foreignKey: 'blog_post_id', as: 'blogPost' });

BlogCategory.belongsToMany(BlogPost, { 
  through: BlogPostCategory, 
  foreignKey: 'category_id',
  otherKey: 'blog_post_id',
  as: 'blogPosts'
});

// Contest associations
Contest.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Contest.hasMany(ContestSubmission, { foreignKey: 'contest_id', as: 'submissions' });

ContestSubmission.belongsTo(Contest, { foreignKey: 'contest_id', as: 'contest' });
ContestSubmission.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Quiz associations
QuizQuestion.hasMany(QuizResponse, { foreignKey: 'question_id', as: 'responses' });
QuizResponse.belongsTo(QuizQuestion, { foreignKey: 'question_id', as: 'question' });
QuizResponse.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

QuizSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Points and payments
PointTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
PointTransaction.belongsTo(PaymentTransaction, { foreignKey: 'payment_transaction_id', as: 'paymentTransaction' });

PaymentTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
PaymentTransaction.belongsTo(Subscription, { foreignKey: 'subscription_id', as: 'subscription' });

// Subscriptions
Subscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Access codes
AccessCode.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
AccessCode.belongsTo(User, { foreignKey: 'created_by', as: 'createdBy' });

// Notifications
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Event registrations
EventRegistration.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
EventRegistration.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Agent reviews
AgentReview.belongsTo(Agent, { foreignKey: 'agent_id', as: 'agent' });
AgentReview.belongsTo(User, { foreignKey: 'reviewer_id', as: 'reviewer' });

// Agent client relationships
AgentClientRelationship.belongsTo(Agent, { foreignKey: 'agent_id', as: 'agent' });
AgentClientRelationship.belongsTo(User, { foreignKey: 'client_id', as: 'client' });

// Client upgrade
ClientUpgrade.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
ClientUpgrade.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

// Recommendation associations
// Recommendation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// Recommendation.hasMany(RecommendationEngagement, { foreignKey: 'recommendation_id', as: 'engagements' });

// Recommendation engagements
// RecommendationEngagement.belongsTo(Recommendation, { foreignKey: 'recommendation_id', as: 'recommendation' });

// Badge associations
// Badge.hasMany(UserBadge, { foreignKey: 'badge_id', as: 'userBadges' });

// User badges
// UserBadge.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// UserBadge.belongsTo(Badge, { foreignKey: 'badge_id', as: 'badge' });

module.exports = {
  sequelize,
  User,
  Agent,
  Event,
  BlogPost,
  BlogImage,
  BlogCategory,
  BlogPostCategory,
  QuizQuestion,
  QuizResponse,
  QuizSession,
  Contest,
  ContestSubmission,
  PointTransaction,
  PaymentTransaction,
  Subscription,
  AccessCode,
  Notification,
  EventRegistration,
  AgentReview,
  AgentClientRelationship,
  ClientUpgrade
  // Recommendation,
  // RecommendationEngagement,
  // Badge,
  // UserBadge
}; 