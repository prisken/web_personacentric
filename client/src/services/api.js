const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Set auth token to localStorage
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('token');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    console.log('=== REQUEST METHOD DEBUG ===');
    console.log('endpoint:', endpoint);
    console.log('options:', options);
    console.log('options.headers:', options.headers);
    console.log('main app token:', token);
    console.log('options.headers?.Authorization:', options.headers?.Authorization);
    console.log('Condition (token && !options.headers?.Authorization):', token && !options.headers?.Authorization);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Only set Authorization if not already provided in options.headers
        ...(token && !options.headers?.Authorization && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('Final config.headers:', config.headers);
    console.log('=== END REQUEST METHOD DEBUG ===');

    console.log(`Making ${options.method || 'GET'} request to:`, url);
    console.log('Request config:', {
      ...config,
      headers: { ...config.headers }
    });
    console.log('Full headers object:', config.headers);
    console.log('Authorization header specifically:', config.headers.Authorization);

    try {
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(e => {
          console.error('Failed to parse error response:', e);
          return {};
        });
        console.error('Response error data:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', {
        url,
        method: options.method || 'GET',
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Handle FormData (for file uploads) vs JSON data
    if (data instanceof FormData) {
      // Don't set Content-Type for FormData, let the browser set it with boundary
      delete config.headers['Content-Type'];
      config.body = data;
    } else {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (data instanceof FormData) {
      delete config.headers['Content-Type'];
      config.body = data;
    } else {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // PATCH request
  async patch(endpoint, data, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      method: 'PATCH',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (data instanceof FormData) {
      delete config.headers['Content-Type'];
      config.body = data;
    } else {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // File upload method
  async uploadFile(endpoint, formData, options = {}) {
    return this.post(endpoint, formData, options);
  }

  // Auth endpoints
  async login(credentials) {
    // Temporary workaround: use debug-login endpoint since main login is having issues
    try {
      const response = await this.post('/auth/debug-login', credentials);
      if (response.token) {
        this.setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      // Fallback to main login endpoint
      const response = await this.post('/auth/login', credentials);
      if (response.token) {
        this.setAuthToken(response.token);
      }
      return response;
    }
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

  async getQuickLoginUsers() {
    return this.get('/auth/quick-login-users');
  }

  // Dashboard endpoints
  async getDashboard() {
    return this.get('/dashboard');
  }

  async getUserStats() {
    return this.get('/dashboard/stats');
  }

  // User endpoints
  async getCurrentUser() {
    return this.get('/users/me');
  }

  async updateProfile(userData) {
    return this.put('/users/profile', userData);
  }

  // Agent profile endpoints
  async updateAgentProfile(profileData) {
    return this.put('/users/agent/profile', profileData);
  }

  async getMyAgentProfile() {
    return this.get('/users/agent/me');
  }

  // Event endpoints
  async getEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/events${queryString ? `?${queryString}` : ''}`);
  }

  async getEvent(id) {
    return this.get(`/events/${id}`);
  }

  async registerForEvent(eventId) {
    return this.post(`/events/${eventId}/register`, {});
  }

  async cancelEventRegistration(eventId) {
    return this.post(`/events/${eventId}/cancel`, {});
  }

  async getUserEventRegistrations() {
    return this.get('/events/user/registrations');
  }

  // Admin event management
  async createEvent(eventData) {
    return this.post('/events', eventData);
  }

  async updateEvent(eventId, eventData) {
    return this.put(`/events/${eventId}`, eventData);
  }

  async deleteEvent(eventId) {
    return this.delete(`/events/${eventId}`);
  }

  async getEventRegistrations(eventId) {
    return this.get(`/events/${eventId}/registrations`);
  }

  async updateRegistrationStatus(eventId, registrationId, status) {
    return this.put(`/events/${eventId}/registrations/${registrationId}`, { status });
  }

  // Agent event management
  async getAgentEvents() {
    return this.get('/events/agent/my-events');
  }

  async addParticipantToEvent(eventId, userId) {
    return this.post(`/events/${eventId}/add-participant`, { user_id: userId });
  }

  async removeParticipantFromEvent(eventId, userId) {
    return this.delete(`/events/${eventId}/remove-participant/${userId}`);
  }



  // Blog endpoints
  async getBlogs() {
    return this.get('/blogs');
  }

  async getBlog(id) {
    return this.get(`/blogs/${id}`);
  }

  // Contest endpoints
  async getContests() {
    return this.get('/contests');
  }

  async getContest(id) {
    return this.get(`/contests/${id}`);
  }

  async submitContestEntry(contestId, entryData) {
    return this.post(`/contests/${contestId}/submit`, entryData);
  }

  // AI endpoints
  async generateContent(prompt) {
    return this.post('/ai/generate', { prompt });
  }

  // Payment endpoints
  async createPayment(paymentData) {
    return this.post('/payments/create', paymentData);
  }

  async getPaymentHistory() {
    return this.get('/payments/history');
  }

  // Admin endpoints
  async getAdminStats() {
    return this.get('/admin/stats');
  }

  async getUsers() {
    return this.get('/admin/users');
  }

  async updateUserRole(userId, role) {
    return this.put(`/admin/users/${userId}/role`, { role });
  }

  // Gift endpoints
  async getPublicGifts() {
    return this.get('/gifts/public');
  }

  async getGifts() {
    return this.get('/gifts');
  }

  async getGiftCategories() {
    return this.get('/gifts/categories');
  }

  async createGift(giftData) {
    return this.post('/gifts', giftData);
  }

  async updateGift(giftId, giftData) {
    return this.put(`/gifts/${giftId}`, giftData);
  }

  async deleteGift(giftId) {
    return this.delete(`/gifts/${giftId}`);
  }

  async redeemGift(giftId) {
    return this.post(`/gifts/${giftId}/redeem`, {});
  }

  async getGiftRedemptions() {
    return this.get('/gifts/user/redemptions');
  }

  async getGiftStats() {
    return this.get('/gifts/stats');
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }

  // Client Management endpoints (for agents)
  async getAgentClients() {
    return this.get('/client-management/clients');
  }

  async getClientDetails(clientId) {
    return this.get(`/client-management/clients/${clientId}`);
  }

  async addClient(clientData) {
    return this.post('/client-management/clients', clientData);
  }

  async updateClient(clientId, updateData) {
    return this.put(`/client-management/clients/${clientId}`, updateData);
  }

  async removeClient(clientId) {
    return this.delete(`/client-management/clients/${clientId}`);
  }

  async getClientStats(clientId) {
    return this.get(`/client-management/clients/${clientId}/stats`);
  }

  // Client relationship management (for clients)
  async getClientRelationships() {
    return this.get('/client-management/client/relationships');
  }

  async confirmRelationship(relationshipId) {
    return this.post(`/client-management/client/relationships/${relationshipId}/confirm`);
  }

  async rejectRelationship(relationshipId) {
    return this.post(`/client-management/client/relationships/${relationshipId}/reject`);
  }

  // Generate invitation code for client
  async generateInvitationCode() {
    return this.post('/client-management/client/generate-invitation-code');
  }

  // Agent endpoints
  async getAgents() {
    return this.get('/agents');
  }

  // Super Admin endpoints
  async getSuperAdminDashboard() {
    return this.get('/super-admin/dashboard');
  }

  async getSuperAdminUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/super-admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async updateSuperAdminUser(userId, userData) {
    return this.put(`/super-admin/users/${userId}`, userData);
  }

  async updateSuperAdminUserRole(userId, role) {
    return this.put(`/super-admin/users/${userId}/role`, { role });
  }

  async deleteSuperAdminUser(userId, confirmation, reason) {
    return this.delete(`/super-admin/users/${userId}`, {
      body: JSON.stringify({ confirmation, reason })
    });
  }

  // Food for Talk endpoints
  async registerForFoodForTalk(userData) {
    return this.post('/food-for-talk/register', userData);
  }

  async loginToFoodForTalk(credentials) {
    return this.post('/food-for-talk/login', credentials);
  }

  async secretLoginToFoodForTalk(credentials) {
    return this.post('/food-for-talk/secret-login', credentials);
  }

  async getFoodForTalkParticipants() {
    // Use the Food for Talk specific token
    const token = localStorage.getItem('foodForTalkToken');
    console.log('Token being sent:', token);
    console.log('Authorization header:', `Bearer ${token}`);
    return this.get('/food-for-talk/participants', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async getFoodForTalkChatParticipants() {
    // Use the Food for Talk secret token
    const token = localStorage.getItem('foodForTalkSecretToken');
    console.log('Secret token being sent:', token);
    console.log('Secret Authorization header:', `Bearer ${token}`);
    return this.get('/food-for-talk/chat-participants', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async getFoodForTalkStats() {
    return this.get('/food-for-talk/stats');
  }

  async getFoodForTalkAdminParticipants() {
    return this.get('/food-for-talk/admin/participants');
  }

  async toggleFoodForTalkParticipantStatus(participantId, isActive) {
    return this.patch(`/food-for-talk/admin/participants/${participantId}/toggle-status`, { isActive });
  }

  async deleteFoodForTalkParticipant(participantId) {
    return this.delete(`/food-for-talk/admin/participants/${participantId}`);
  }

  async regenerateFoodForTalkPasskey(participantId) {
    return this.patch(`/food-for-talk/admin/participants/${participantId}/regenerate-passkey`);
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService; 