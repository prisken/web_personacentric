/**
 * API Services Index
 * Centralized export of all API services
 */

import authService from './authService';
import userService from './userService';
import eventService from './eventService';
import dashboardService from './dashboardService';

// Legacy API service for backward compatibility
import BaseApiService from './baseApiService';

// Create a legacy service instance for components that haven't been refactored yet
const legacyApiService = new BaseApiService();

// Add all the legacy methods to maintain backward compatibility
Object.assign(legacyApiService, {
  // Auth methods
  login: authService.login.bind(authService),
  register: authService.register.bind(authService),
  logout: authService.logout.bind(authService),

  // User methods
  getCurrentUser: userService.getCurrentUser.bind(userService),
  updateProfile: userService.updateProfile.bind(userService),
  updateAgentProfile: userService.updateAgentProfile.bind(userService),
  getMyAgentProfile: userService.getMyAgentProfile.bind(userService),
  getUsers: userService.getUsers.bind(userService),
  updateUserRole: userService.updateUserRole.bind(userService),

  // Event methods
  getEvents: eventService.getEvents.bind(eventService),
  getEvent: eventService.getEvent.bind(eventService),
  createEvent: eventService.createEvent.bind(eventService),
  updateEvent: eventService.updateEvent.bind(eventService),
  deleteEvent: eventService.deleteEvent.bind(eventService),
  registerForEvent: eventService.registerForEvent.bind(eventService),
  cancelEventRegistration: eventService.cancelEventRegistration.bind(eventService),
  getUserEventRegistrations: eventService.getUserEventRegistrations.bind(eventService),
  getEventRegistrations: eventService.getEventRegistrations.bind(eventService),
  updateRegistrationStatus: eventService.updateRegistrationStatus.bind(eventService),
  getAgentEvents: eventService.getAgentEvents.bind(eventService),
  addParticipantToEvent: eventService.addParticipantToEvent.bind(eventService),
  removeParticipantFromEvent: eventService.removeParticipantFromEvent.bind(eventService),

  // Dashboard methods
  getDashboard: dashboardService.getDashboard.bind(dashboardService),
  getUserStats: dashboardService.getDashboardStats.bind(dashboardService),
  getAdminStats: dashboardService.getAdminStats.bind(dashboardService),
  getSuperAdminDashboard: dashboardService.getSuperAdminDashboard.bind(dashboardService),

  // Health check
  healthCheck: legacyApiService.healthCheck.bind(legacyApiService)
});

// Export individual services
export {
  authService,
  userService,
  eventService,
  dashboardService
};

// Export legacy service for backward compatibility
export default legacyApiService;
