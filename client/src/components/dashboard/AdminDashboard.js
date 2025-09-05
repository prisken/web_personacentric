import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import apiService from '../../services/api';
import BlogManagement from './BlogManagement';
import GiftManagement from './GiftManagement';
import QuizManagement from './QuizManagement';
import EventDetailsOverlay from '../EventDetailsOverlay';
import StatisticsCard from './StatisticsCard';

const AdminDashboard = ({ data, onRefresh }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [accessCodes, setAccessCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [userManagementSubTab, setUserManagementSubTab] = useState('clients'); // Add this line

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'HKD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const fetchUsers = async () => {
    try {
      const response = await apiService.get('/admin/users');
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  // Fetch users when component mounts and when users tab is active
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch events when events tab is active
  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      const response = await apiService.getEvents();
      if (response.success) {
        setEvents(response.events || []);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Fetch events error:', error);
      setEvents([]);
    }
  };


  const handleSeedData = async () => {
    try {
      setLoading(true);
      if (window.confirm(t('dashboard.actions.confirmSeedData'))) {
        await apiService.post('/admin/seed-data');
        alert(t('dashboard.actions.seedDataSuccess'));
        await fetchUsers(); // Refresh users list
      }
    } catch (error) {
      console.error('Seed data error:', error);
      alert(t('dashboard.actions.seedDataFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action, newRole = null) => {
    try {
      setLoading(true);
      if (action === 'delete') {
        if (window.confirm('確定要刪除此用戶嗎？此操作無法撤銷。')) {
          await apiService.delete(`/admin/users/${userId}`);
          await fetchUsers(); // Refresh users list
        }
      } else if (action === 'updateRole' && newRole) {
        await apiService.put(`/admin/users/${userId}/role`, { role: newRole });
        await fetchUsers(); // Refresh users list
      }
      onRefresh();
    } catch (error) {
      console.error('User action error:', error);
      alert('操作失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const generateAccessCode = async () => {
    try {
      setLoading(true);
      const response = await apiService.post('/admin/access-codes');
      if (response.success) {
        setAccessCodes(prev => [response.accessCode, ...prev]);
        alert('訪問碼已生成！');
      }
    } catch (error) {
      console.error('Generate access code error:', error);
      alert('生成訪問碼失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '總覽', icon: '📊' },
    { id: 'users', label: '用戶管理', icon: '👥' },
    { id: 'events', label: '活動管理', icon: '📅' },
    { id: 'blogs', label: '部落格管理', icon: '📝' },
    { id: 'gifts', label: '禮品管理', icon: '🎁' },
    { id: 'quizzes', label: '測驗管理', icon: '📋' },
    { id: 'accessCodes', label: '訪問碼', icon: '🔑' },
    { id: 'analytics', label: '數據分析', icon: '📈' },
    { id: 'settings', label: '系統設定', icon: '⚙️' }
  ];

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Dashboard Header - Mobile Optimized */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col space-y-4 py-4 sm:py-6 lg:py-8">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                👑 管理員儀表板
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                管理平台用戶和系統設定
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleSeedData}
                disabled={loading}
                className="w-full sm:w-auto bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm"
              >
                {loading ? '添加中...' : '添加示例數據'}
              </button>
              <button
                onClick={onRefresh}
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm"
              >
                {loading ? '更新中...' : '刷新數據'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* Mobile: Dropdown for tabs */}
          <div className="block sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.icon} {tab.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Desktop: Horizontal tabs */}
          <nav className="hidden sm:flex space-x-1 lg:space-x-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 lg:py-4 px-3 lg:px-6 border-b-2 font-medium text-sm lg:text-base whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2 lg:mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Statistics Cards - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <StatisticsCard
                title="總用戶"
                value={data.statistics?.total_users || 0}
                icon="👥"
                color="blue"
              />
              <StatisticsCard
                title="活躍用戶"
                value={data.statistics?.active_users || 0}
                icon="✅"
                color="green"
              />
              <StatisticsCard
                title="總活動"
                value={data.statistics?.total_events || 0}
                icon="📅"
                color="yellow"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">最近註冊用戶</h3>
                </div>
                <div className="p-6">
                  {data.recent_users?.map((user) => (
                    <div key={user.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'admin' ? '管理員' : user.role === 'agent' ? '顧問' : '客戶'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Payments */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">最近付款</h3>
                </div>
                <div className="p-6">
                  {data.recent_payments?.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {payment.user.first_name} {payment.user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">月費訂閱</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Management Header */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">用戶管理</h3>
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    新增用戶
                  </button>
                </div>
              </div>
              
              {/* Sub-tabs for user management */}
              <div className="px-6 py-3 border-b border-gray-200">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setUserManagementSubTab('clients')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      userManagementSubTab === 'clients'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    👥 客戶管理 ({users.filter(u => u.role === 'client').length})
                  </button>
                  <button
                    onClick={() => setUserManagementSubTab('agents')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      userManagementSubTab === 'agents'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    🎯 顧問管理 ({users.filter(u => u.role === 'agent').length})
                  </button>
                </div>
              </div>
            </div>

            {/* Clients Management */}
            {userManagementSubTab === 'clients' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-gray-900">客戶列表</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        共 {users.filter(u => u.role === 'client').length} 位客戶
                      </span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          客戶資訊
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          狀態
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          註冊日期
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          投資偏好
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.filter(user => user.role === 'client').map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-green-700">
                                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name} {user.last_name}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-xs text-gray-400">{user.phone || '無電話'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              活躍
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.client ? (
                              <div className="text-sm text-gray-900">
                                <div><span className="font-medium">目標:</span> {user.client.primary_goal || '未設定'}</div>
                                <div><span className="font-medium">風險:</span> {user.client.risk_tolerance || '未設定'}</div>
                                <div><span className="font-medium">時長:</span> {user.client.investment_timeline || '未設定'}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">未完成設定</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                查看詳情
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="text-red-600 hover:text-red-900"
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
              </div>
            )}

            {/* Agents Management */}
            {userManagementSubTab === 'agents' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-gray-900">顧問列表</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        共 {users.filter(u => u.role === 'agent').length} 位顧問
                      </span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          顧問資訊
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          狀態
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          註冊日期
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          專業資訊
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.filter(user => user.role === 'agent').map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-700">
                                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name} {user.last_name}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-xs text-gray-400">{user.phone || '無電話'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              活躍
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.agent ? (
                              <div className="text-sm text-gray-900">
                                <div><span className="font-medium">專長:</span> {user.agent.areas_of_expertise?.join(', ') || '未設定'}</div>
                                <div><span className="font-medium">經驗:</span> {user.agent.experience_years || 0} 年</div>
                                <div><span className="font-medium">語言:</span> {user.agent.languages?.join(', ') || '未設定'}</div>
                                <div><span className="font-medium">地點:</span> {user.agent.location || '未設定'}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">未完成設定</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                查看詳情
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="text-red-600 hover:text-red-900"
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
              </div>
            )}
          </div>
        )}

        {/* Events Management Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <StatisticsCard
                title="總活動"
                value={data.statistics?.total_events || 0}
                icon="📅"
                color="blue"
              />
              <StatisticsCard
                title="即將舉行"
                value={data.statistics?.upcoming_events || 0}
                icon="⏰"
                color="green"
              />
              <StatisticsCard
                title="總註冊"
                value={data.statistics?.total_registrations || 0}
                icon="👥"
                color="yellow"
              />
              <StatisticsCard
                title="客戶註冊"
                value={data.statistics?.total_clients_registered || 0}
                icon="👤"
                color="purple"
              />
            </div>

            {/* All Events Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">📊 所有活動</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm lg:text-base text-gray-500">
                    共 {data.all_events?.length || 0} 個活動
                  </span>
                  <button
                    onClick={() => navigate('/admin/events')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    新增活動
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {data.all_events?.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105">
                    {/* Event Image */}
                    <div className="h-32 sm:h-40 lg:h-48 xl:h-56 overflow-hidden relative">
                      <img 
                        src={event.image ? event.image : "/images/food-for-talk.jpg"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === 'published' ? 'bg-green-100 text-green-800' :
                          event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status === 'published' ? '已發布' :
                           event.status === 'draft' ? '草稿' :
                           event.status === 'cancelled' ? '已取消' : event.status}
                        </span>
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-4 sm:p-6 lg:p-8">
                      {/* Event Type Badge */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                        <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs lg:text-sm font-medium text-white bg-blue-500">
                          {event.event_type === 'workshop' ? '工作坊' :
                           event.event_type === 'seminar' ? '研討會' :
                           event.event_type === 'consultation' ? '諮詢' :
                           event.event_type === 'webinar' ? '網路研討會' : event.event_type}
                        </span>
                        <span className="text-xs lg:text-sm text-gray-500">
                          {event.registrations?.total || 0} 已註冊
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 line-clamp-2">
                        {event.title}
                      </h3>

                      {/* Event Description */}
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 lg:mb-6 line-clamp-3">
                        {event.description}
                      </p>

                      {/* Registration Statistics */}
                      <div className="mb-4 sm:mb-6 lg:mb-8 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{event.registrations?.clients || 0}</p>
                            <p className="text-gray-500">客戶</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{event.registrations?.agents || 0}</p>
                            <p className="text-gray-500">顧問</p>
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-1 sm:space-y-2 lg:space-y-3 mb-4 sm:mb-6 lg:mb-8">
                        <div className="flex items-center text-xs sm:text-sm lg:text-base text-gray-500">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 lg:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(event.start_date)}
                        </div>
                        {event.location && (
                          <div className="flex items-center text-xs sm:text-sm lg:text-base text-gray-500">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 lg:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowEventDetails(true);
                          }}
                          className="flex-1 bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          查看詳情
                        </button>
                        
                        <button
                          onClick={() => navigate(`/admin/events/${event.id}`)}
                          className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-blue-700 transition-all duration-300"
                        >
                          編輯活動
                        </button>
                        
                        <button
                          onClick={() => navigate(`/admin/events/${event.id}/registrations`)}
                          className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold hover:bg-gray-50 transition-all duration-300"
                        >
                          查看註冊
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {(!data.all_events || data.all_events.length === 0) && (
                <div className="text-center py-8 sm:py-12 lg:py-16">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 max-w-md mx-auto">
                    <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-gray-400 mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-2">
                      暫無活動
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-500">
                      開始創建您的第一個活動
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Moderation Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">內容審核</h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2">暫無待審核內容</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Management Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">付款管理</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用戶
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金額
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        狀態
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日期
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.recent_payments?.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.user.first_name} {payment.user.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {payment.status === 'completed' ? '已完成' : payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Access Codes Tab */}
        {activeTab === 'accessCodes' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">訪問碼管理</h3>
                <button
                  onClick={generateAccessCode}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? '生成中...' : '生成新訪問碼'}
                </button>
              </div>
            </div>
            <div className="p-6">
              {accessCodes.length > 0 ? (
                <div className="space-y-4">
                  {accessCodes.map((code, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">訪問碼: {code.code}</p>
                        <p className="text-xs text-gray-500">生成時間: {formatDate(code.created_at)}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        未使用
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <p className="mt-2">暫無訪問碼</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Blogs Management Tab */}
        {activeTab === 'blogs' && (
          <BlogManagement />
        )}

        {/* Gifts Management Tab */}
        {activeTab === 'gifts' && (
          <GiftManagement />
        )}

        {/* Quizzes Management Tab */}
        {activeTab === 'quizzes' && (
          <QuizManagement />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">系統設定</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">平台設定</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">維護模式</p>
                      <p className="text-sm text-gray-500">暫時關閉平台進行維護</p>
                    </div>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                      關閉
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">新用戶註冊</p>
                      <p className="text-sm text-gray-500">允許新用戶註冊</p>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      開啟
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">內容審核</p>
                      <p className="text-sm text-gray-500">自動審核內容</p>
                    </div>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                      關閉
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Details Overlay */}
      <EventDetailsOverlay
        event={selectedEvent}
        isOpen={showEventDetails}
        onClose={() => {
          setShowEventDetails(false);
          setSelectedEvent(null);
        }}
        onRegistrationChange={onRefresh}
      />
    </div>
  );
};

export default AdminDashboard; 