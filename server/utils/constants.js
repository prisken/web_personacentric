/**
 * Server-side Constants
 * Centralized constants for roles, permissions, and other server-wide values
 */

// User Roles
const USER_ROLES = {
  CLIENT: 'client',
  AGENT: 'agent',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// Role Labels (for display)
const ROLE_LABELS = {
  [USER_ROLES.CLIENT]: 'Client',
  [USER_ROLES.AGENT]: 'Agent',
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin'
};

// Permission Types
const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLES: 'user:manage_roles',
  
  // Content Management
  CONTENT_CREATE: 'content:create',
  CONTENT_READ: 'content:read',
  CONTENT_UPDATE: 'content:update',
  CONTENT_DELETE: 'content:delete',
  CONTENT_MODERATE: 'content:moderate',
  
  // Event Management
  EVENT_CREATE: 'event:create',
  EVENT_READ: 'event:read',
  EVENT_UPDATE: 'event:update',
  EVENT_DELETE: 'event:delete',
  EVENT_MANAGE_REGISTRATIONS: 'event:manage_registrations',
  
  // Blog Management
  BLOG_CREATE: 'blog:create',
  BLOG_READ: 'blog:read',
  BLOG_UPDATE: 'blog:update',
  BLOG_DELETE: 'blog:delete',
  BLOG_PUBLISH: 'blog:publish',
  
  // Quiz Management
  QUIZ_CREATE: 'quiz:create',
  QUIZ_READ: 'quiz:read',
  QUIZ_UPDATE: 'quiz:update',
  QUIZ_DELETE: 'quiz:delete',
  QUIZ_MANAGE_QUESTIONS: 'quiz:manage_questions',
  
  // Point Management
  POINT_AWARD: 'point:award',
  POINT_DEDUCT: 'point:deduct',
  POINT_MANAGE_RULES: 'point:manage_rules',
  POINT_VIEW_TRANSACTIONS: 'point:view_transactions',
  
  // Payment Management
  PAYMENT_VIEW: 'payment:view',
  PAYMENT_REFUND: 'payment:refund',
  PAYMENT_MANAGE: 'payment:manage',
  PAYMENT_VIEW_TRANSACTIONS: 'payment:view_transactions',
  
  // System Management
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_ANALYTICS: 'system:analytics',
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_MAINTENANCE: 'system:maintenance',
  
  // Admin Management
  ADMIN_CREATE: 'admin:create',
  ADMIN_MANAGE: 'admin:manage',
  ADMIN_REMOVE: 'admin:remove',
  
  // Access Code Management
  ACCESS_CODE_GENERATE: 'access_code:generate',
  ACCESS_CODE_MANAGE: 'access_code:manage',
  
  // Data Management
  DATA_SEED: 'data:seed',
  DATA_EXPORT: 'data:export',
  DATA_IMPORT: 'data:import'
};

// Role Permission Mapping
const ROLE_PERMISSIONS = {
  [USER_ROLES.CLIENT]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.EVENT_READ,
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.QUIZ_READ
  ],
  
  [USER_ROLES.AGENT]: [
    // All client permissions
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.EVENT_READ,
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.QUIZ_READ,
    // Agent-specific permissions
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.EVENT_CREATE,
    PERMISSIONS.EVENT_UPDATE,
    PERMISSIONS.EVENT_MANAGE_REGISTRATIONS
  ],
  
  [USER_ROLES.ADMIN]: [
    // All client permissions
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.EVENT_READ,
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.QUIZ_READ,
    // Agent permissions
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.EVENT_CREATE,
    PERMISSIONS.EVENT_UPDATE,
    PERMISSIONS.EVENT_MANAGE_REGISTRATIONS,
    // Admin-specific permissions
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.CONTENT_DELETE,
    PERMISSIONS.CONTENT_MODERATE,
    PERMISSIONS.EVENT_DELETE,
    PERMISSIONS.BLOG_CREATE,
    PERMISSIONS.BLOG_UPDATE,
    PERMISSIONS.BLOG_DELETE,
    PERMISSIONS.BLOG_PUBLISH,
    PERMISSIONS.QUIZ_CREATE,
    PERMISSIONS.QUIZ_UPDATE,
    PERMISSIONS.QUIZ_DELETE,
    PERMISSIONS.QUIZ_MANAGE_QUESTIONS
  ],
  
  [USER_ROLES.SUPER_ADMIN]: [
    // All permissions
    ...Object.values(PERMISSIONS)
  ]
};

// Helper Functions
const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};

const isSuperAdmin = (userRole) => {
  return userRole === USER_ROLES.SUPER_ADMIN;
};

const isAdmin = (userRole) => {
  return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN;
};

const isAgent = (userRole) => {
  return userRole === USER_ROLES.AGENT || isAdmin(userRole);
};

const isClient = (userRole) => {
  return userRole === USER_ROLES.CLIENT || isAgent(userRole);
};

// Route Permission Mapping
const ROUTE_PERMISSIONS = {
  // User Management Routes
  'GET /super-admin/users': [PERMISSIONS.USER_READ],
  'POST /super-admin/users': [PERMISSIONS.USER_CREATE],
  'PUT /super-admin/users/:id': [PERMISSIONS.USER_UPDATE],
  'DELETE /super-admin/users/:id': [PERMISSIONS.USER_DELETE],
  'PUT /super-admin/users/:id/role': [PERMISSIONS.USER_MANAGE_ROLES],
  
  // Point Management Routes
  'GET /super-admin/points/transactions': [PERMISSIONS.POINT_VIEW_TRANSACTIONS],
  'POST /super-admin/points/award': [PERMISSIONS.POINT_AWARD],
  'POST /super-admin/points/deduct': [PERMISSIONS.POINT_DEDUCT],
  
  // Payment Management Routes
  'GET /super-admin/payments/transactions': [PERMISSIONS.PAYMENT_VIEW_TRANSACTIONS],
  'POST /super-admin/payments/refund': [PERMISSIONS.PAYMENT_REFUND],
  
  // Admin Management Routes
  'GET /super-admin/admins': [PERMISSIONS.ADMIN_MANAGE],
  'POST /super-admin/admins': [PERMISSIONS.ADMIN_CREATE],
  'DELETE /super-admin/admins/:id': [PERMISSIONS.ADMIN_REMOVE],
  
  // Content Management Routes (Admin)
  'POST /admin/events': [PERMISSIONS.EVENT_CREATE],
  'PUT /admin/events/:id': [PERMISSIONS.EVENT_UPDATE],
  'DELETE /admin/events/:id': [PERMISSIONS.EVENT_DELETE],
  'POST /admin/blogs': [PERMISSIONS.BLOG_CREATE],
  'PUT /admin/blogs/:id': [PERMISSIONS.BLOG_UPDATE],
  'DELETE /admin/blogs/:id': [PERMISSIONS.BLOG_DELETE],
  'POST /admin/quizzes': [PERMISSIONS.QUIZ_CREATE],
  'PUT /admin/quizzes/:id': [PERMISSIONS.QUIZ_UPDATE],
  'DELETE /admin/quizzes/:id': [PERMISSIONS.QUIZ_DELETE],
  
  // Access Code Routes
  'POST /super-admin/access-codes/generate': [PERMISSIONS.ACCESS_CODE_GENERATE],
  
  // Data Seeding Routes
  'POST /super-admin/seed-data': [PERMISSIONS.DATA_SEED]
};

// Check if user has permission for a specific route
const hasRoutePermission = (userRole, method, path) => {
  const routeKey = `${method} ${path}`;
  const requiredPermissions = ROUTE_PERMISSIONS[routeKey];
  
  if (!requiredPermissions) {
    // Route not in permission list, allow access
    return true;
  }
  
  return hasAnyPermission(userRole, requiredPermissions);
};

// Default Super Admin Permissions
const DEFAULT_SUPER_ADMIN_PERMISSIONS = {
  [PERMISSIONS.USER_CREATE]: true,
  [PERMISSIONS.USER_READ]: true,
  [PERMISSIONS.USER_UPDATE]: true,
  [PERMISSIONS.USER_DELETE]: true,
  [PERMISSIONS.USER_MANAGE_ROLES]: true,
  [PERMISSIONS.POINT_AWARD]: true,
  [PERMISSIONS.POINT_DEDUCT]: true,
  [PERMISSIONS.POINT_MANAGE_RULES]: true,
  [PERMISSIONS.POINT_VIEW_TRANSACTIONS]: true,
  [PERMISSIONS.PAYMENT_VIEW]: true,
  [PERMISSIONS.PAYMENT_REFUND]: true,
  [PERMISSIONS.PAYMENT_MANAGE]: true,
  [PERMISSIONS.PAYMENT_VIEW_TRANSACTIONS]: true,
  [PERMISSIONS.SYSTEM_CONFIG]: true,
  [PERMISSIONS.SYSTEM_ANALYTICS]: true,
  [PERMISSIONS.ADMIN_CREATE]: true,
  [PERMISSIONS.ADMIN_MANAGE]: true,
  [PERMISSIONS.ADMIN_REMOVE]: true,
  [PERMISSIONS.ACCESS_CODE_GENERATE]: true,
  [PERMISSIONS.ACCESS_CODE_MANAGE]: true,
  [PERMISSIONS.DATA_SEED]: true,
  [PERMISSIONS.DATA_EXPORT]: true,
  [PERMISSIONS.DATA_IMPORT]: true
};

module.exports = {
  USER_ROLES,
  ROLE_LABELS,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ROUTE_PERMISSIONS,
  DEFAULT_SUPER_ADMIN_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRoutePermission,
  getRoleLabel,
  isSuperAdmin,
  isAdmin,
  isAgent,
  isClient
}; 