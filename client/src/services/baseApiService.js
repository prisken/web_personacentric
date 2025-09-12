/**
 * Base API Service
 * Core API functionality shared across all domain services
 */

import logger from '../utils/logger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class BaseApiService {
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

    logger.apiRequest(options.method || 'GET', url, options.body);

    try {
      const response = await fetch(url, config);
      logger.apiResponse(options.method || 'GET', url, response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(e => {
          logger.error('Failed to parse error response:', e);
          return {};
        });
        logger.apiError(options.method || 'GET', url, errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logger.apiError(options.method || 'GET', url, error);
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

    logger.apiRequest('POST', url, data);

    try {
      const response = await fetch(url, config);
      logger.apiResponse('POST', url, response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.apiError('POST', url, errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      logger.apiError('POST', url, error);
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

    logger.apiRequest('PUT', url, data);

    try {
      const response = await fetch(url, config);
      logger.apiResponse('PUT', url, response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.apiError('PUT', url, errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      logger.apiError('PUT', url, error);
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

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

export default BaseApiService;

