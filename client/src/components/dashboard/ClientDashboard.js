import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import apiService from '../../services/api';
import RecommendationGame from './RecommendationGame';

const ClientDashboard = ({ data, onRefresh }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const handleEventRegistration = async (eventId) => {
    try {
      setLoading(true);
      await apiService.post(`/events/${eventId}/register`);
      onRefresh();
      alert('活動註冊成功！');
    } catch (error) {
      console.error('Event registration error:', error);
      alert('註冊失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '總覽', icon: '📊' },
    { id: 'agent', label: '顧問連接', icon: '👥' },
    { id: 'events', label: '活動管理', icon: '📅' },
    { id: 'recommendations', label: '推薦遊戲', icon: '💡' },
    { id: 'points', label: '積分管理', icon: '🎯' },
    { id: 'contests', label: '競賽參與', icon: '🏆' },
    { id: 'profile', label: '個人資料', icon: '👤' }
  ];

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 lg:py-12 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 lg:mb-4">
                👤 客戶儀表板
              </h1>
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-600">
                管理您的財務規劃和學習進度
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-base lg:text-lg"
              >
                {loading ? '更新中...' : '刷新數據'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 lg:space-x-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-3 lg:px-6 border-b-2 font-medium text-sm lg:text-base whitespace-nowrap transition-all duration-300 ${
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 lg:space-y-12">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 lg:ml-6">
                    <p className="text-sm lg:text-base font-medium text-gray-500">投資總額</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      $50,000
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 lg:ml-6">
                    <p className="text-sm lg:text-base font-medium text-gray-500">投資回報</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      +12.5%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 lg:ml-6">
                    <p className="text-sm lg:text-base font-medium text-gray-500">參與活動</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {data.statistics?.attended_events || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 lg:ml-6">
                    <p className="text-sm lg:text-base font-medium text-gray-500">積分餘額</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {data.statistics?.points_balance || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Registered Events */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">已註冊活動</h3>
                </div>
                <div className="p-6">
                  {data.registered_events?.map((registration) => (
                    <div key={registration.id} className="py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{registration.event.title}</p>
                          <p className="text-sm text-gray-500">{registration.event.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(registration.event.start_date)}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {registration.status === 'registered' ? '已註冊' : registration.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Events */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">可參加活動</h3>
                </div>
                <div className="p-6">
                  {data.available_events?.map((event) => (
                    <div key={event.id} className="py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(event.start_date)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEventRegistration(event.id)}
                          disabled={loading}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          {loading ? '註冊中...' : '註冊'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agent Connection Tab */}
        {activeTab === 'agent' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">顧問連接</h3>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-2">暫無配對顧問</p>
                <p className="text-sm mt-1">前往顧問配對頁面尋找適合的財務顧問</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  開始配對
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events Management Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* My Events */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">我的活動</h3>
              </div>
              <div className="p-6">
                {data.registered_events?.length > 0 ? (
                  <div className="space-y-4">
                    {data.registered_events.map((registration) => (
                      <div key={registration.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{registration.event.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{registration.event.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              開始時間: {formatDate(registration.event.start_date)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              {registration.status === 'registered' ? '已註冊' : registration.status}
                            </span>
                            <button className="text-blue-600 hover:text-blue-900 text-sm">
                              查看詳情
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2">暫無註冊活動</p>
                  </div>
                )}
              </div>
            </div>

            {/* Available Events */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">可參加活動</h3>
              </div>
              <div className="p-6">
                {data.available_events?.length > 0 ? (
                  <div className="space-y-4">
                    {data.available_events.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              開始時間: {formatDate(event.start_date)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleEventRegistration(event.id)}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loading ? '註冊中...' : '立即註冊'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2">暫無可參加活動</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Game Tab */}
        {activeTab === 'recommendations' && (
          <RecommendationGame />
        )}

        {/* Points Management Tab */}
        {activeTab === 'points' && (
          <div className="space-y-6">
            {/* Points Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">積分摘要</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {data.statistics?.total_points_earned || 0}
                  </p>
                  <p className="text-sm text-gray-500">總積分</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {data.statistics?.points_balance || 0}
                  </p>
                  <p className="text-sm text-gray-500">當前餘額</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {data.statistics?.total_events_attended || 0}
                  </p>
                  <p className="text-sm text-gray-500">參與活動</p>
                </div>
              </div>
            </div>

            {/* Points History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">積分歷史</h3>
              </div>
              <div className="p-6">
                {data.recent_point_transactions?.length > 0 ? (
                  <div className="space-y-4">
                    {data.recent_point_transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {transaction.transaction_type === 'earned' ? '獲得' : '使用'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            transaction.points_amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.points_amount > 0 ? '+' : ''}{transaction.points_amount}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(transaction.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="mt-2">暫無積分記錄</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contest Participation Tab */}
        {activeTab === 'contests' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">競賽參與</h3>
                  <button
                    onClick={() => setShowContestModal(true)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                  >
                    參與競賽
                  </button>
                </div>
              </div>
              <div className="p-6">
                {data.contest_participations?.length > 0 ? (
                  <div className="space-y-4">
                    {data.contest_participations.map((participation) => (
                      <div key={participation.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{participation.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              競賽: {participation.contest.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              提交時間: {formatDate(participation.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              participation.status === 'approved' ? 'bg-green-100 text-green-800' :
                              participation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {participation.status === 'approved' ? '已通過' : 
                               participation.status === 'pending' ? '審核中' : '未通過'}
                            </span>
                            <button className="text-blue-600 hover:text-blue-900 text-sm">
                              查看詳情
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p className="mt-2">暫無競賽參與記錄</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">個人資料</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名</label>
                  <input
                    type="text"
                    defaultValue={`${data.user?.first_name || ''} ${data.user?.last_name || ''}`}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">電子郵件</label>
                  <input
                    type="email"
                    defaultValue={data.user?.email || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">投資目標</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>{data.client?.primary_goal || ''}</option>
                    <option>子女教育</option>
                    <option>購屋置產</option>
                    <option>財富增值</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">風險承受度</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>{data.client?.risk_tolerance || ''}</option>
                    <option>積極型</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">投資經驗</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>{data.client?.investment_experience || ''}</option>
                    <option>有經驗</option>
                    <option>專業投資者</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    更新資料
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard; 