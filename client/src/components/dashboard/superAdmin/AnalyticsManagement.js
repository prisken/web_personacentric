import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../../services/api';

const AnalyticsManagement = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get(`/super-admin/analytics?days=${dateRange}`);
      setAnalytics(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.message || 'Failed to fetch analytics');
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'HKD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">分析報告</h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">時間範圍:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="7">過去7天</option>
            <option value="30">過去30天</option>
            <option value="90">過去90天</option>
            <option value="365">過去一年</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {analytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">新用戶註冊</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.new_users || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">💳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">總收入</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(analytics.total_revenue || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">活動參與</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.event_participations || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">⭐</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">積分交易</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.point_transactions || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">用戶增長趨勢</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="mt-2">圖表功能即將推出</p>
              </div>
            </div>
          </div>

          {/* Revenue Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">收入分析</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">收入來源</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">月費訂閱</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(analytics.revenue_by_type?.subscription || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">活動費用</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(analytics.revenue_by_type?.events || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">其他</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(analytics.revenue_by_type?.other || 0)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">用戶轉換率</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">註冊轉換</span>
                    <span className="text-sm font-medium">
                      {formatPercentage(analytics.conversion_rates?.registration || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">付費轉換</span>
                    <span className="text-sm font-medium">
                      {formatPercentage(analytics.conversion_rates?.payment || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">活動參與</span>
                    <span className="text-sm font-medium">
                      {formatPercentage(analytics.conversion_rates?.events || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">熱門內容</h3>
            <div className="space-y-4">
              {analytics.top_events?.map((event, index) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{event.participants} 參與者</p>
                    <p className="text-xs text-gray-500">{formatCurrency(event.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">系統性能</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {analytics.system_performance?.uptime || '99.9%'}
                </p>
                <p className="text-sm text-gray-500">系統正常運行時間</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.system_performance?.response_time || '120ms'}
                </p>
                <p className="text-sm text-gray-500">平均響應時間</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.system_performance?.active_sessions || '0'}
                </p>
                <p className="text-sm text-gray-500">活躍會話</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsManagement;
