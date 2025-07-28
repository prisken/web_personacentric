import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import apiService from '../../services/api';
import AgentProfileImageUpload from '../AgentProfileImageUpload';
import FinancialPlanningTab from './FinancialPlanningTab';

const AgentDashboard = ({ data, onRefresh }) => {
  // Persist activeTab in localStorage
  const getInitialTab = () => localStorage.getItem('agentDashboardActiveTab') || 'overview';
  const [activeTab, setActiveTab] = useState(getInitialTab());
  useEffect(() => {
    localStorage.setItem('agentDashboardActiveTab', activeTab);
  }, [activeTab]);

  const [showEventModal, setShowEventModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(data.agent?.profile_image || null);
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  // Update local image state if parent data changes (e.g., after refresh)
  useEffect(() => {
    setProfileImageUrl(data.agent?.profile_image || null);
  }, [data.agent?.profile_image]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'HKD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const handleEventAction = async (eventId, action) => {
    try {
      setLoading(true);
      if (action === 'delete') {
        if (window.confirm('確定要刪除此活動嗎？')) {
          await apiService.delete(`/events/${eventId}`);
        }
      }
      onRefresh();
    } catch (error) {
      console.error('Event action error:', error);
      alert('操作失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const { t } = useTranslation();
  
  const tabs = [
    { id: 'overview', label: t('dashboard.tabs.overview'), icon: '📊' },
    { id: 'clients', label: t('dashboard.tabs.agentConnection'), icon: '👥' },
    { id: 'events', label: t('dashboard.tabs.events'), icon: '📅' },
    { id: 'content', label: t('dashboard.tabs.blogManagement'), icon: '📝' },
    { id: 'analytics', label: t('dashboard.tabs.points'), icon: '🎯' },
    { id: 'contests', label: t('dashboard.tabs.contests'), icon: '🏆' },
    { id: 'financial_planning', label: t('financialPlanning.tab'), icon: '💰' },
    { id: 'profile', label: t('dashboard.tabs.profile'), icon: '👤' }
  ];

  // Utility to notify other components (like Header) of profile image update
  const notifyProfileImageUpdated = () => {
    window.dispatchEvent(new CustomEvent('agent-profile-image-updated'));
  };

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 lg:py-12 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 lg:mb-4">
                👨‍💼 顧問儀表板
              </h1>
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-600">
                管理您的客戶和業務
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
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-xl lg:text-2xl">💰</span>
                    </div>
                  </div>
                  <div className="ml-4 lg:ml-6">
                    <p className="text-sm lg:text-base font-medium text-gray-500">總佣金</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {formatCurrency(data.statistics?.total_commission || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-xl lg:text-2xl">👥</span>
                    </div>
                  </div>
                  <div className="ml-4 lg:ml-6">
                    <p className="text-sm lg:text-base font-medium text-gray-500">活躍客戶</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {data.statistics?.active_clients || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-xl lg:text-2xl">📅</span>
                    </div>
                  </div>
                  <div className="ml-4 lg:ml-6">
                    <p className="text-sm lg:text-base font-medium text-gray-500">舉辦活動</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {data.statistics?.hosted_events || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-xl lg:text-2xl">🎯</span>
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
              {/* Client Relationships */}
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900">客戶關係</h3>
                </div>
                <div className="p-6">
                  {data.client_relationships?.map((relationship) => (
                    <div key={relationship.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm lg:text-base font-medium text-blue-600">
                            {relationship.client.first_name.charAt(0)}{relationship.client.last_name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm lg:text-base font-medium text-gray-900">
                            {relationship.client.first_name} {relationship.client.last_name}
                          </p>
                          <p className="text-sm lg:text-base text-gray-500">{relationship.client.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm lg:text-base font-medium text-gray-900">
                          {formatCurrency(relationship.total_commission)}
                        </p>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {relationship.status === 'active' ? '活躍' : relationship.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Events */}
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900">最近活動</h3>
                </div>
                <div className="p-6">
                  {data.recent_events?.map((event) => (
                    <div key={event.id} className="py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm lg:text-base font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm lg:text-base text-gray-500">{event.description}</p>
                          <p className="text-xs lg:text-sm text-gray-400 mt-1">
                            {formatDate(event.start_date)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status === 'upcoming' ? '即將舉行' : 
                           event.status === 'ongoing' ? '進行中' : '已結束'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clients Management Tab */}
        {activeTab === 'clients' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">客戶管理</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        客戶
                      </th>
                      <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        狀態
                      </th>
                      <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        總佣金
                      </th>
                      <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        建立日期
                      </th>
                      <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.client_relationships?.map((relationship) => (
                      <tr key={relationship.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm lg:text-base font-medium text-blue-600">
                                {relationship.client.first_name.charAt(0)}{relationship.client.last_name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm lg:text-base font-medium text-gray-900">
                                {relationship.client.first_name} {relationship.client.last_name}
                              </div>
                              <div className="text-sm lg:text-base text-gray-500">{relationship.client.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {relationship.status === 'active' ? '活躍' : relationship.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm lg:text-base font-medium text-gray-900">
                          {formatCurrency(relationship.total_commission)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm lg:text-base text-gray-500">
                          {formatDate(relationship.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm lg:text-base font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            查看詳情
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            發送訊息
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Events Management Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">活動管理</h3>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  新增活動
                </button>
              </div>
            </div>
            <div className="p-6">
              {data.recent_events?.length > 0 ? (
                <div className="space-y-4">
                  {data.recent_events.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg lg:text-xl font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm lg:text-base text-gray-600 mt-1">{event.description}</p>
                          <p className="text-xs lg:text-sm text-gray-500 mt-2">
                            開始時間: {formatDate(event.start_date)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status === 'upcoming' ? '即將舉行' : 
                             event.status === 'ongoing' ? '進行中' : '已結束'}
                          </span>
                          <button className="text-blue-600 hover:text-blue-900 text-sm">
                            編輯
                          </button>
                          <button
                            onClick={() => handleEventAction(event.id, 'delete')}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            刪除
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
                  <p className="mt-2">暫無活動</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Creation Tab */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">內容創作</h3>
                <button
                  onClick={() => setShowBlogModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  撰寫文章
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2">暫無文章</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">績效摘要</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-green-600">
                    {data.statistics?.total_commission || 0}
                  </p>
                  <p className="text-sm lg:text-base text-gray-500">總績效分數</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                    {data.statistics?.points_balance || 0}
                  </p>
                  <p className="text-sm lg:text-base text-gray-500">當前餘額</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-purple-600">
                    {data.statistics?.active_clients || 0}
                  </p>
                  <p className="text-sm lg:text-base text-gray-500">活躍客戶</p>
                </div>
              </div>
            </div>

            {/* Performance History */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">績效歷史</h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-2">暫無績效記錄</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contest Participation Tab */}
        {activeTab === 'contests' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">競賽參與</h3>
                <button
                  onClick={() => setShowContestModal(true)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                >
                  參與競賽
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="mt-2">暫無競賽參與記錄</p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Planning Tab */}
        {activeTab === 'financial_planning' && (
          <FinancialPlanningTab />
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">個人資料</h3>
            </div>
            <div className="p-6">

              <div className="space-y-6">
                {showProfileSuccess && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-center font-medium">
                    個人照片已成功更新！
                  </div>
                )}
                {/* Profile Image Upload */}
                <div>
                  <h4 className="text-md lg:text-lg font-medium text-gray-900 mb-4">個人照片</h4>
                  <AgentProfileImageUpload
                    currentImageUrl={profileImageUrl || 'https://ui-avatars.com/api/?name=Agent&background=ddd&color=555&size=128'}
                    onImageUploaded={(imageUrl) => {
                      setProfileImageUrl(imageUrl);
                      setShowProfileSuccess(true);
                      setTimeout(() => setShowProfileSuccess(false), 3000);
                      notifyProfileImageUpdated();
                      // Update parent data.agent.profile_image if possible
                      if (data.agent) data.agent.profile_image = imageUrl;
                      setActiveTab('profile'); // Stay on profile tab
                    }}
                    className="mb-6"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700">姓名</label>
                  <input
                    type="text"
                    defaultValue={`${data.user?.first_name || ''} ${data.user?.last_name || ''}`}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700">電子郵件</label>
                  <input
                    type="email"
                    defaultValue={data.user?.email || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700">專業領域 (多個以逗號分隔)</label>
                  <input
                    type="text"
                    defaultValue={data.agent?.areas_of_expertise?.join(', ') || ''}
                    placeholder="投資規劃, 退休, 稅務..."
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700">語言 (多個以逗號分隔)</label>
                  <input
                    type="text"
                    defaultValue={data.agent?.languages?.join(', ') || ''}
                    placeholder="中文, 英文, 粵語..."
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700">偏好客戶類型 (多個以逗號分隔)</label>
                  <input
                    type="text"
                    defaultValue={data.agent?.preferred_client_types?.join(', ') || ''}
                    placeholder="年輕專業人士, 家庭, 企業主..."
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700">溝通方式 (多選)</label>
                  <div className="flex flex-wrap gap-4 mt-1">
                    {['面對面', '視訊', '電話', '數位/文字'].map((mode) => (
                      <label key={mode} className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={data.agent?.communication_modes?.includes(mode)}
                          className="mr-2"
                        />
                        {mode}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700">可預約時段</label>
                  <input
                    type="text"
                    defaultValue={data.agent?.availability || ''}
                    placeholder="Mon-Fri 9am-5pm"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700">地區/城市</label>
                  <input
                    type="text"
                    defaultValue={data.agent?.location || ''}
                    placeholder="Hong Kong, Taipei..."
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700">狀態</label>
                  <input
                    type="text"
                    value={data.agent?.status || 'pending'}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-2 bg-gray-100"
                  />
                </div>
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    defaultChecked={data.agent?.in_matching_pool}
                    className="mr-2"
                  />
                  <span className="text-sm lg:text-base font-medium text-gray-700">加入配對池 (可被客戶配對)</span>
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-base lg:text-lg">
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

export default AgentDashboard; 