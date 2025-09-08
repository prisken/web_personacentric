/**
 * Application Constants
 * Centralized constants for roles, permissions, and other app-wide values
 */

// User Roles
export const USER_ROLES = {
  CLIENT: 'client',
  AGENT: 'agent',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// Role Labels (for display)
export const ROLE_LABELS = {
  [USER_ROLES.CLIENT]: 'Client',
  [USER_ROLES.AGENT]: 'Agent',
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin'
};

// Role Emojis (for display)
export const ROLE_EMOJIS = {
  [USER_ROLES.CLIENT]: '👤',
  [USER_ROLES.AGENT]: '👨‍💼',
  [USER_ROLES.ADMIN]: '👑',
  [USER_ROLES.SUPER_ADMIN]: '👑'
};

// Role Colors (for UI styling)
export const ROLE_COLORS = {
  [USER_ROLES.CLIENT]: 'bg-green-100 text-green-800',
  [USER_ROLES.AGENT]: 'bg-blue-100 text-blue-800',
  [USER_ROLES.ADMIN]: 'bg-purple-100 text-purple-800',
  [USER_ROLES.SUPER_ADMIN]: 'bg-red-100 text-red-800'
};

// Permission Types
export const PERMISSIONS = {
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

// Helper Functions
export const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};

export const getRoleEmoji = (role) => {
  return ROLE_EMOJIS[role] || '❓';
};

export const getRoleColor = (role) => {
  return ROLE_COLORS[role] || 'bg-gray-100 text-gray-800';
};

export const isSuperAdmin = (userRole) => {
  return userRole === USER_ROLES.SUPER_ADMIN;
};

export const isAdmin = (userRole) => {
  return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN;
};

export const isAgent = (userRole) => {
  return userRole === USER_ROLES.AGENT || isAdmin(userRole);
};

export const isClient = (userRole) => {
  return userRole === USER_ROLES.CLIENT || isAgent(userRole);
};

// Base permission sets to avoid circular dependencies
const CLIENT_PERMISSIONS = [
  PERMISSIONS.CONTENT_READ,
  PERMISSIONS.EVENT_READ,
  PERMISSIONS.BLOG_READ,
  PERMISSIONS.QUIZ_READ
];

const AGENT_PERMISSIONS = [
  ...CLIENT_PERMISSIONS,
  PERMISSIONS.CONTENT_CREATE,
  PERMISSIONS.EVENT_CREATE,
  PERMISSIONS.EVENT_UPDATE,
  PERMISSIONS.EVENT_MANAGE_REGISTRATIONS,
  PERMISSIONS.QUIZ_READ
];

const ADMIN_PERMISSIONS = [
  ...AGENT_PERMISSIONS,
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
];

// Role Permission Mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.CLIENT]: CLIENT_PERMISSIONS,
  [USER_ROLES.AGENT]: AGENT_PERMISSIONS,
  [USER_ROLES.ADMIN]: ADMIN_PERMISSIONS,
  [USER_ROLES.SUPER_ADMIN]: [
    ...Object.values(PERMISSIONS)
  ]
};

// Base endpoint sets to avoid circular dependencies
const CLIENT_ENDPOINTS = [
  '/events',
  '/blogs',
  '/quizzes',
  '/profile'
];

const AGENT_ENDPOINTS = [
  ...CLIENT_ENDPOINTS,
  '/agent/events',
  '/agent/clients',
  '/agent/dashboard'
];

const ADMIN_ENDPOINTS = [
  ...AGENT_ENDPOINTS,
  '/admin/events',
  '/admin/blogs',
  '/admin/quizzes',
  '/admin/dashboard'
];

// API Endpoints by Role
export const ROLE_ENDPOINTS = {
  [USER_ROLES.CLIENT]: CLIENT_ENDPOINTS,
  [USER_ROLES.AGENT]: AGENT_ENDPOINTS,
  [USER_ROLES.ADMIN]: ADMIN_ENDPOINTS,
  [USER_ROLES.SUPER_ADMIN]: [
    ...ADMIN_ENDPOINTS,
    '/super-admin/users',
    '/super-admin/points',
    '/super-admin/payments',
    '/super-admin/admins',
    '/super-admin/system'
  ]
};

// Base navigation sets to avoid circular dependencies
const CLIENT_NAVIGATION = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/events', label: 'Events', icon: '📅' },
  { path: '/blogs', label: 'Blogs', icon: '📝' },
  { path: '/quizzes', label: 'Quizzes', icon: '🧠' },
  { path: '/profile', label: 'Profile', icon: '👤' }
];

const AGENT_NAVIGATION = [
  ...CLIENT_NAVIGATION,
  { path: '/agent/clients', label: 'My Clients', icon: '👥' },
  { path: '/agent/events', label: 'My Events', icon: '🎯' },
  { path: '/agent/analytics', label: 'Analytics', icon: '📊' }
];

const ADMIN_NAVIGATION = [
  ...AGENT_NAVIGATION,
  { path: '/admin/events', label: 'Manage Events', icon: '📅' },
  { path: '/admin/blogs', label: 'Manage Blogs', icon: '📝' },
  { path: '/admin/quizzes', label: 'Manage Quizzes', icon: '🧠' },
  { path: '/admin/dashboard', label: 'Admin Dashboard', icon: '⚙️' }
];

// Navigation Items by Role
export const ROLE_NAVIGATION = {
  [USER_ROLES.CLIENT]: CLIENT_NAVIGATION,
  [USER_ROLES.AGENT]: AGENT_NAVIGATION,
  [USER_ROLES.ADMIN]: ADMIN_NAVIGATION,
  [USER_ROLES.SUPER_ADMIN]: [
    ...ADMIN_NAVIGATION,
    { path: '/super-admin/users', label: 'User Management', icon: '👥' },
    { path: '/super-admin/points', label: 'Point Management', icon: '⭐' },
    { path: '/super-admin/payments', label: 'Payment Management', icon: '💳' },
    { path: '/super-admin/admins', label: 'Admin Management', icon: '👑' },
    { path: '/super-admin/system', label: 'System Settings', icon: '⚙️' }
  ]
};
