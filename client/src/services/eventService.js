/**
 * Event Service
 * Handles all event-related API calls
 */

import BaseApiService from './baseApiService';

class EventService extends BaseApiService {
  async getEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/events${queryString ? `?${queryString}` : ''}`);
  }

  async getEvent(id) {
    return this.get(`/events/${id}`);
  }

  async createEvent(eventData) {
    return this.post('/events', eventData);
  }

  async updateEvent(eventId, eventData) {
    return this.put(`/events/${eventId}`, eventData);
  }

  async deleteEvent(eventId) {
    return this.delete(`/events/${eventId}`);
  }

  async registerForEvent(eventId) {
    return this.post(`/events/${eventId}/register`, {});
  }

  async cancelEventRegistration(eventId) {
    return this.delete(`/events/${eventId}/register`);
  }

  async getUserEventRegistrations() {
    return this.get('/events/user/registrations');
  }

  async getEventRegistrations(eventId) {
    return this.get(`/events/${eventId}/registrations`);
  }

  async updateRegistrationStatus(eventId, registrationId, status) {
    return this.put(`/events/${eventId}/registrations/${registrationId}`, { status });
  }

  async getAgentEvents() {
    return this.get('/events/agent/my-events');
  }

  async addParticipantToEvent(eventId, userId) {
    return this.post(`/events/${eventId}/add-participant`, { user_id: userId });
  }

  async removeParticipantFromEvent(eventId, userId) {
    return this.delete(`/events/${eventId}/remove-participant/${userId}`);
  }

  async getEventStats(eventId) {
    return this.get(`/events/${eventId}/stats`);
  }

  async getUpcomingEvents() {
    return this.get('/events/upcoming');
  }

  async getPastEvents() {
    return this.get('/events/past');
  }

  async searchEvents(query) {
    return this.get(`/events/search?q=${encodeURIComponent(query)}`);
  }

  async getEventsByCategory(category) {
    return this.get(`/events/category/${category}`);
  }

  async publishEvent(eventId) {
    return this.put(`/events/${eventId}/publish`);
  }

  async unpublishEvent(eventId) {
    return this.put(`/events/${eventId}/unpublish`);
  }
}

export default new EventService();
