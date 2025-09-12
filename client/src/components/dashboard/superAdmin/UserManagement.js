import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryCounts, setCategoryCounts] = useState({});
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    subscription_status: '',
    points: 0
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchUsers = async (page = 1, category = 'all', search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: page.toString(),
        limit: '100', // Increased limit to ensure we get all users
        category: category,
        search: search,
        _t: Date.now().toString() // Cache-busting
      };
      
      console.log('🔍 Fetching users with params:', params);
      const response = await apiService.getSuperAdminUsers(params);
      console.log('📊 API Response:', response);
      
      if (response.success) {
        const users = response.users || [];
        const categoryCounts = response.categoryCounts || {};
        const pagination = response.pagination || {};
        
        setUsers(users);
        setCategoryCounts(categoryCounts);
        setPagination(pagination);
        setCurrentPage(page);
        setLastUpdated(new Date());
        
        console.log('✅ Users loaded successfully:');
        console.log(`  - Users returned: ${users.length}`);
        console.log(`  - Total in database: ${pagination.total}`);
        console.log(`  - Category counts:`, categoryCounts);
        
        // Log any discrepancies
        if (users.length !== pagination.total) {
          console.warn(`⚠️  Warning: API returned ${users.length} users but total is ${pagination.total}`);
        }
      } else {
        const errorMsg = response.error || 'Failed to fetch users';
        setError(errorMsg);
        setUsers([]);
        console.error('❌ API returned error:', errorMsg);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
      setUsers([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, 'all', '');
  }, []);

  // Auto-refresh every 15 seconds to keep data fresh and show new registrations
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers(currentPage, selectedCategory, searchTerm);
    }, 15000); // 15 seconds for more frequent updates

    return () => clearInterval(interval);
  }, [currentPage, selectedCategory, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchUsers(1, category, searchTerm);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiService.updateSuperAdminUserRole(userId, newRole);
      fetchUsers(currentPage, selectedCategory, searchTerm);
    } catch (error) {
      setError(error.message || 'Failed to update user role');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditingUser({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      subscription_status: user.subscription_status || '',
      points: user.points || 0
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateSuperAdminUser(selectedUser.id, editingUser);
      setShowEditModal(false);
      fetchUsers(currentPage, selectedCategory, searchTerm);
    } catch (error) {
      setError(error.message || 'Failed to update user');
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteReason('');
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    if (!deleteReason.trim() || deleteReason.trim().length < 10) {
      setError('Please provide a deletion reason (minimum 10 characters)');
      return;
    }

    try {
      await apiService.deleteSuperAdminUser(selectedUser.id, 'DELETE_USER_CONFIRMED', deleteReason);
      setShowDeleteModal(false);
      setDeleteReason('');
      fetchUsers(currentPage, selectedCategory, searchTerm);
    } catch (error) {
      setError(error.message || 'Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'agent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'client': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  const getSubscriptionStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'grace_period': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">載入用戶資料中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">用戶管理</h2>
            <p className="text-gray-600 mt-1">管理所有用戶帳戶和權限</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fetchUsers(currentPage, selectedCategory, searchTerm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              title="刷新數據"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>刷新</span>
            </button>
            <div className="text-sm text-gray-500">
              總計 {pagination.total || 0} 位用戶
              {lastUpdated && (
                <div className="text-xs text-gray-400 mt-1">
                  最後更新: {lastUpdated.toLocaleTimeString('zh-TW')}
                  {loading && <span className="ml-2 text-blue-500">更新中...</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">錯誤</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部 ({categoryCounts.all || 0})
            </button>
            <button
              onClick={() => handleCategoryChange('super_admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'super_admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              超級管理員 ({categoryCounts.super_admin || 0})
            </button>
            <button
              onClick={() => handleCategoryChange('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'admin'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              管理員 ({categoryCounts.admin || 0})
            </button>
            <button
              onClick={() => handleCategoryChange('agent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'agent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              顧問 ({categoryCounts.agent || 0})
            </button>
            <button
              onClick={() => handleCategoryChange('client')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'client'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              客戶 ({categoryCounts.client || 0})
            </button>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋用戶 (姓名、電郵、電話)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              搜尋
            </button>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用戶資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  聯絡方式
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  加入日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.first_name?.charAt(0) || 'U'}{user.last_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.points || 0} 積分
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone || '未設定'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.role === 'super_admin'}
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${getRoleBadgeColor(user.role)} ${
                        user.role === 'super_admin' ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                      }`}
                    >
                      <option value="client">客戶</option>
                      <option value="agent">顧問</option>
                      <option value="admin">管理員</option>
                      <option value="super_admin">超級管理員</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSubscriptionStatusColor(user.subscription_status)}`}>
                      {user.subscription_status === 'active' ? '活躍' :
                       user.subscription_status === 'inactive' ? '非活躍' :
                       user.subscription_status === 'grace_period' ? '寬限期' : user.subscription_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        disabled={user.role === 'super_admin'}
                        className={`transition-colors ${
                          user.role === 'super_admin'
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-900'
                        }`}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => fetchUsers(currentPage - 1, selectedCategory, searchTerm)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一頁
              </button>
              <button
                onClick={() => fetchUsers(currentPage + 1, selectedCategory, searchTerm)}
                disabled={currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一頁
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  顯示第 <span className="font-medium">{((currentPage - 1) * 20) + 1}</span> 到{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 20, pagination.total)}
                  </span>{' '}
                  項，共 <span className="font-medium">{pagination.total}</span> 項結果
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => fetchUsers(currentPage - 1, selectedCategory, searchTerm)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一頁
                  </button>
                  <button
                    onClick={() => fetchUsers(currentPage + 1, selectedCategory, searchTerm)}
                    disabled={currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一頁
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">編輯用戶</h3>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editingUser.first_name}
                      onChange={(e) => setEditingUser({...editingUser, first_name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="名字"
                    />
                    <input
                      type="text"
                      value={editingUser.last_name}
                      onChange={(e) => setEditingUser({...editingUser, last_name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="姓氏"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">電郵</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">電話</label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="電話號碼"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">訂閱狀態</label>
                  <select
                    value={editingUser.subscription_status}
                    onChange={(e) => setEditingUser({...editingUser, subscription_status: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="active">活躍</option>
                    <option value="inactive">非活躍</option>
                    <option value="grace_period">寬限期</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">積分</label>
                  <input
                    type="number"
                    value={editingUser.points}
                    onChange={(e) => setEditingUser({...editingUser, points: parseInt(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    更新
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mt-4">確認刪除用戶</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 text-center">
                  您即將刪除用戶 <strong>{selectedUser.first_name} {selectedUser.last_name}</strong> ({selectedUser.email})
                </p>
                <p className="text-sm text-red-600 text-center mt-2">
                  此操作無法撤銷！
                </p>
              </div>
              <form onSubmit={handleDeleteUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">刪除原因 *</label>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    placeholder="請詳細說明刪除此用戶的原因 (至少10個字符)"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                  >
                    確認刪除
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;