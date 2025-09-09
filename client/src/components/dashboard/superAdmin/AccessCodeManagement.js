import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../../services/api';

const AccessCodeManagement = () => {
  const [accessCodes, setAccessCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState({
    code: '',
    expires_at: '',
    max_uses: 1
  });

  const fetchAccessCodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get('/super-admin/access-codes');
      const codesData = response?.access_codes || [];
      setAccessCodes(Array.isArray(codesData) ? codesData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching access codes:', error);
      setError(error.message || 'Failed to fetch access codes');
      setAccessCodes([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccessCodes();
  }, [fetchAccessCodes]);

  const handleCreateCode = async () => {
    try {
      await apiService.post('/super-admin/access-codes', newCode);
      setShowCreateModal(false);
      setNewCode({ code: '', expires_at: '', max_uses: 1 });
      fetchAccessCodes();
    } catch (error) {
      setError(error.message || 'Failed to create access code');
    }
  };

  const handleDeleteCode = async (codeId) => {
    if (!window.confirm('確定要刪除此存取碼嗎？')) return;
    
    try {
      await apiService.delete(`/super-admin/access-codes/${codeId}`);
      fetchAccessCodes();
    } catch (error) {
      setError(error.message || 'Failed to delete access code');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
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
        <h2 className="text-2xl font-bold text-gray-900">存取碼管理</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          新增存取碼
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">存取碼列表</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  存取碼
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用次數
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最大使用次數
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  過期時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(accessCodes || []).map((code) => (
                <tr key={code.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {code.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.uses || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.max_uses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.expires_at ? formatDate(code.expires_at) : '永不過期'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      code.is_used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {code.is_used ? '已使用' : '可用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteCode(code.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">新增存取碼</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">存取碼</label>
                  <input
                    type="text"
                    value={newCode.code}
                    onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="輸入存取碼"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">過期時間</label>
                  <input
                    type="datetime-local"
                    value={newCode.expires_at}
                    onChange={(e) => setNewCode({ ...newCode, expires_at: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">最大使用次數</label>
                  <input
                    type="number"
                    value={newCode.max_uses}
                    onChange={(e) => setNewCode({ ...newCode, max_uses: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="1"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateCode}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  創建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessCodeManagement;
