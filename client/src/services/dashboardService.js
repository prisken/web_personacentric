/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

import BaseApiService from './baseApiService';

class DashboardService extends BaseApiService {
  async getDashboard() {
    return this.get('/dashboard');
  }

  async getDashboardStats() {
    return this.get('/dashboard/stats');
  }

  async getAdminStats() {
    return this.get('/admin/stats');
  }

  async getSuperAdminDashboard() {
    return this.get('/super-admin/dashboard');
  }

  async getRecentActivity() {
    return this.get('/dashboard/recent-activity');
  }

  async getAnalyticsData(timeRange = '30d') {
    return this.get(`/dashboard/analytics?range=${timeRange}`);
  }

  async getUserMetrics() {
    return this.get('/dashboard/user-metrics');
  }

  async getSystemHealth() {
    return this.get('/dashboard/system-health');
  }

  async getPerformanceMetrics() {
    return this.get('/dashboard/performance');
  }

  async getRevenueData(timeRange = '30d') {
    return this.get(`/dashboard/revenue?range=${timeRange}`);
  }

  async getEngagementMetrics() {
    return this.get('/dashboard/engagement');
  }

  async getConversionRates() {
    return this.get('/dashboard/conversion');
  }

  async getTopContent() {
    return this.get('/dashboard/top-content');
  }

  async getTopEvents() {
    return this.get('/dashboard/top-events');
  }

  async getTopUsers() {
    return this.get('/dashboard/top-users');
  }
}

export default new DashboardService();

