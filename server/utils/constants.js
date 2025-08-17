// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

// User Roles
const USER_ROLES = {
  CLIENT: 'client',
  AGENT: 'agent',
  ADMIN: 'admin'
};

// User Status
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

// Event Status
const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Subscription Types
const SUBSCRIPTION_TYPES = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
};

// File Upload Limits
const UPLOAD_LIMITS = {
  IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Rate Limiting
const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
};

// JWT
const JWT = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d'
};

// Database
const DATABASE = {
  MAX_CONNECTIONS: 10,
  MIN_CONNECTIONS: 0,
  ACQUIRE_TIMEOUT: 60000,
  TIMEOUT: 60000
};

// Email Templates
const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
  EMAIL_VERIFICATION: 'email-verification',
  EVENT_REMINDER: 'event-reminder'
};

// Notification Types
const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  EVENT: 'event',
  PAYMENT: 'payment',
  SECURITY: 'security'
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  USER_STATUS,
  EVENT_STATUS,
  PAYMENT_STATUS,
  SUBSCRIPTION_TYPES,
  UPLOAD_LIMITS,
  PAGINATION,
  RATE_LIMITS,
  JWT,
  DATABASE,
  EMAIL_TEMPLATES,
  NOTIFICATION_TYPES
}; 