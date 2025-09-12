/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import BaseApiService from './baseApiService';

class AuthService extends BaseApiService {
  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async logout() {
    this.removeAuthToken();
    return { success: true };
  }

  async refreshToken() {
    const response = await this.post('/auth/refresh');
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, newPassword) {
    return this.post('/auth/reset-password', { token, newPassword });
  }

  async verifyEmail(token) {
    return this.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail() {
    return this.post('/auth/resend-verification');
  }
}

export default new AuthService();

