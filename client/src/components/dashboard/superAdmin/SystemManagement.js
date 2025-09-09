import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../../services/api';

const SystemManagement = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSystemInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get('/super-admin/system/info');
      setSystemInfo(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching system info:', error);
      setError(error.message || 'Failed to fetch system information');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemInfo();
  }, [fetchSystemInfo]);

  const handleSeedData = async () => {
    if (!window.confirm('確定要重新種子數據嗎？這將覆蓋現有數據。')) return;
    
    try {
      setActionLoading(true);
      await apiService.post('/super-admin/system/seed-data');
      alert('數據種子已成功執行！');
      fetchSystemInfo();
    } catch (error) {
      setError(error.message || 'Failed to seed data');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSystemRestart = async () => {
    if (!window.confirm('確定要重啟系統嗎？這將暫時中斷服務。')) return;
    
    try {
      setActionLoading(true);
      await apiService.post('/super-admin/system/restart');
      alert('系統重啟已啟動！');
    } catch (error) {
      setError(error.message || 'Failed to restart system');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setActionLoading(true);
      await apiService.post('/super-admin/system/clear-cache');
      alert('緩存已清除！');
      fetchSystemInfo();
    } catch (error) {
      setError(error.message || 'Failed to clear cache');
    } finally {
      setActionLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        <h2 className="text-2xl font-bold text-gray-900">系統配置</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleClearCache}
            disabled={actionLoading}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
          >
            {actionLoading ? '處理中...' : '清除緩存'}
          </button>
          <button
            onClick={handleSeedData}
            disabled={actionLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {actionLoading ? '處理中...' : '種子數據'}
          </button>
          <button
            onClick={handleSystemRestart}
            disabled={actionLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {actionLoading ? '處理中...' : '重啟系統'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {systemInfo && (
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">系統狀態</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  systemInfo.status === 'healthy' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className={`text-2xl ${
                    systemInfo.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {systemInfo.status === 'healthy' ? '✅' : '❌'}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">系統狀態</p>
                <p className="text-xs text-gray-500">
                  {systemInfo.status === 'healthy' ? '正常' : '異常'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-blue-600">⏱️</span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">運行時間</p>
                <p className="text-xs text-gray-500">{systemInfo.uptime || 'N/A'}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-purple-600">💾</span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">內存使用</p>
                <p className="text-xs text-gray-500">
                  {systemInfo.memory ? formatBytes(systemInfo.memory.used) : 'N/A'} / {systemInfo.memory ? formatBytes(systemInfo.memory.total) : 'N/A'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-yellow-600">🖥️</span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">CPU使用率</p>
                <p className="text-xs text-gray-500">{systemInfo.cpu_usage || 'N/A'}%</p>
              </div>
            </div>
          </div>

          {/* Database Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">數據庫信息</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">數據庫狀態</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">數據庫類型</span>
                    <span className="text-sm font-medium">{systemInfo.database?.type || 'SQLite'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">連接狀態</span>
                    <span className={`text-sm font-medium ${
                      systemInfo.database?.connected ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemInfo.database?.connected ? '已連接' : '未連接'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">數據庫大小</span>
                    <span className="text-sm font-medium">
                      {systemInfo.database?.size ? formatBytes(systemInfo.database.size) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">表統計</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">總表數</span>
                    <span className="text-sm font-medium">{systemInfo.database?.tables || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">總記錄數</span>
                    <span className="text-sm font-medium">{systemInfo.database?.total_records || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">最後備份</span>
                    <span className="text-sm font-medium">{systemInfo.database?.last_backup || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">應用配置</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">環境信息</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">環境</span>
                    <span className="text-sm font-medium">{systemInfo.environment || 'production'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Node.js版本</span>
                    <span className="text-sm font-medium">{systemInfo.node_version || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">應用版本</span>
                    <span className="text-sm font-medium">{systemInfo.app_version || '1.0.0'}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">功能開關</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">用戶註冊</span>
                    <span className={`text-sm font-medium ${
                      systemInfo.features?.user_registration ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemInfo.features?.user_registration ? '啟用' : '禁用'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">活動管理</span>
                    <span className={`text-sm font-medium ${
                      systemInfo.features?.event_management ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemInfo.features?.event_management ? '啟用' : '禁用'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">支付系統</span>
                    <span className={`text-sm font-medium ${
                      systemInfo.features?.payment_system ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemInfo.features?.payment_system ? '啟用' : '禁用'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">安全信息</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">認證狀態</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">JWT密鑰</span>
                    <span className={`text-sm font-medium ${
                      systemInfo.security?.jwt_configured ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemInfo.security?.jwt_configured ? '已配置' : '未配置'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">密碼加密</span>
                    <span className={`text-sm font-medium ${
                      systemInfo.security?.password_encryption ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemInfo.security?.password_encryption ? '已啟用' : '未啟用'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">HTTPS</span>
                    <span className={`text-sm font-medium ${
                      systemInfo.security?.https_enabled ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemInfo.security?.https_enabled ? '已啟用' : '未啟用'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">訪問統計</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">今日訪問</span>
                    <span className="text-sm font-medium">{systemInfo.security?.daily_visits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">失敗登錄</span>
                    <span className="text-sm font-medium">{systemInfo.security?.failed_logins || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">最後安全檢查</span>
                    <span className="text-sm font-medium">{systemInfo.security?.last_security_check || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemManagement;
