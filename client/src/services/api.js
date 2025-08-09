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

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

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

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService; 