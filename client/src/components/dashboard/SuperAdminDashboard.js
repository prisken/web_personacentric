import React, { useState } from 'react';
import UserManagement from './superAdmin/UserManagement';
import PointManagement from './superAdmin/PointManagement';
import PaymentManagement from './superAdmin/PaymentManagement';
import AccessCodeManagement from './superAdmin/AccessCodeManagement';
import SystemManagement from './superAdmin/SystemManagement';
import BlogManagement from './BlogManagement';
import QuizManagement from './QuizManagement';
import EventManagement from './superAdmin/EventManagement';
import GiftManagement from './GiftManagement';
import StatisticsCard from './StatisticsCard';

const SuperAdminDashboard = ({ data, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'HKD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const tabs = [
    { id: 'overview', label: '總覽', icon: '📊' },
    { id: 'users', label: '用戶管理', icon: '👥' },
    { id: 'points', label: '積分系統', icon: '⭐' },
    { id: 'payments', label: '付款管理', icon: '💳' },
    { id: 'access-codes', label: '存取碼', icon: '🔑' },
    { id: 'blogs', label: '部落格管理', icon: '📝' },
    { id: 'events', label: '活動管理', icon: '📅' },
    { id: 'quizzes', label: '測驗管理', icon: '📋' },
    { id: 'gifts', label: '禮品管理', icon: '🎁' },
    { id: 'system', label: '系統配置', icon: '⚙️' }
  ];

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Dashboard Header - Mobile Optimized */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col space-y-4 py-4 sm:py-6 lg:py-8">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                👑 超級管理員儀表板
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                完整系統管理和監督
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                title="總管理員"
                value={data.statistics?.total_admins || 0}
                icon="👑"
                color="purple"
              />
              <StatisticsCard
                title="總活動"
                value={data.statistics?.total_events || 0}
                icon="📅"
                color="yellow"
              />
            </div>

            {/* Additional Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <StatisticsCard
                title="總付款"
                value={formatCurrency(data.statistics?.total_payments || 0)}
                icon="💳"
                color="green"
              />
              <StatisticsCard
                title="總積分"
                value={data.statistics?.total_points || 0}
                icon="⭐"
                color="yellow"
              />
              <StatisticsCard
                title="存取碼"
                value={data.statistics?.total_access_codes || 0}
                icon="🔑"
                color="purple"
              />
              <StatisticsCard
                title="系統狀態"
                value="正常"
                icon="⚙️"
                color="green"
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
                          user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'super_admin' ? '超級管理員' :
                           user.role === 'admin' ? '管理員' : 
                           user.role === 'agent' ? '顧問' : '客戶'}
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

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <UserManagement />
        )}

        {/* Points Management Tab */}
        {activeTab === 'points' && (
          <PointManagement />
        )}

        {/* Payment Management Tab */}
        {activeTab === 'payments' && (
          <PaymentManagement />
        )}

        {/* Access Code Management Tab */}
        {activeTab === 'access-codes' && (
          <AccessCodeManagement />
        )}

        {/* Blog Management Tab */}
        {activeTab === 'blogs' && (
          <BlogManagement />
        )}

        {/* Event Management Tab */}
        {activeTab === 'events' && (
          <EventManagement />
        )}

        {/* Quiz Management Tab */}
        {activeTab === 'quizzes' && (
          <QuizManagement />
        )}

        {/* Gift Management Tab */}
        {activeTab === 'gifts' && (
          <GiftManagement />
        )}

        {/* System Management Tab */}
        {activeTab === 'system' && (
          <SystemManagement />
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
