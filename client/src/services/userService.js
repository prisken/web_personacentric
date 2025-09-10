/**
 * User Service
 * Handles all user-related API calls
 */

import BaseApiService from './baseApiService';

class UserService extends BaseApiService {
  async getCurrentUser() {
    return this.get('/users/me');
  }

  async updateProfile(userData) {
    return this.put('/users/profile', userData);
  }

  async updateAgentProfile(profileData) {
    return this.put('/users/agent/profile', profileData);
  }

  async getMyAgentProfile() {
    return this.get('/users/agent/me');
  }

  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUserById(userId) {
    return this.get(`/users/${userId}`);
  }

  async updateUserRole(userId, role) {
    return this.put(`/users/${userId}/role`, { role });
  }

  async deleteUser(userId) {
    return this.delete(`/users/${userId}`);
  }

  async getUserStats() {
    return this.get('/users/stats');
  }

  async searchUsers(query) {
    return this.get(`/users/search?q=${encodeURIComponent(query)}`);
  }

  async updateUserStatus(userId, status) {
    return this.put(`/users/${userId}/status`, { status });
  }

  async getUserActivity(userId) {
    return this.get(`/users/${userId}/activity`);
  }
}

export default new UserService();
