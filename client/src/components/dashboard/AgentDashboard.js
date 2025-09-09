import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import AgentProfileImageUpload from '../AgentProfileImageUpload';
import FinancialPlanningTab from './FinancialPlanningTab';
import ClientManagement from './ClientManagement';
import EventDetailsOverlay from '../EventDetailsOverlay';
import EventCard from './EventCard';
import StatisticsCard from './StatisticsCard';

const AgentDashboard = ({ data, onRefresh }) => {
  // Persist activeTab in localStorage
  const getInitialTab = () => localStorage.getItem('agentDashboardActiveTab') || 'overview';
  const [activeTab, setActiveTab] = useState(getInitialTab());
  useEffect(() => {
    localStorage.setItem('agentDashboardActiveTab', activeTab);
  }, [activeTab]);

  const [loading, setLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(data.agent?.profile_image || null);
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
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


  const handleEventRegistration = async (eventId) => {
    try {
      setLoading(true);
      await apiService.post(`/events/${eventId}/register`);
      onRefresh();
      alert('活動註冊成功！');
    } catch (error) {
      console.error('Event registration error:', error);
      alert('操作失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const handleEventUnregistration = async (eventId) => {
    try {
      setLoading(true);
      await apiService.delete(`/events/${eventId}/register`);
      onRefresh();
      alert('活動註冊已取消！');
    } catch (error) {
      console.error('Event unregistration error:', error);
      alert('操作失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  
  const tabs = [
    { id: 'overview', label: '概覽', icon: '📊' },
    { id: 'events', label: '活動', icon: '📅' },
    { id: 'blogs', label: '部落格', icon: '📝' },
    { id: 'quizzes', label: '測驗', icon: '🧠' },
    { id: 'financial_planning', label: '理財產品配置', icon: '💰' },
    { id: 'clients', label: '客戶配對', icon: '👥', comingSoon: true },
    { id: 'profile', label: '個人資料', icon: '👤' }
  ];

  // Utility to notify other components (like Header) of profile image update
  const notifyProfileImageUpdated = () => {
    window.dispatchEvent(new CustomEvent('agent-profile-image-updated'));
  };

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Dashboard Header - Mobile Optimized */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col space-y-4 py-4 sm:py-6 lg:py-8">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                👨‍💼 顧問儀表板
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                管理您的客戶和業務
              </p>
            </div>
            <div className="flex justify-center sm:justify-start">
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
                <option key={tab.id} value={tab.id} disabled={tab.comingSoon}>
                  {tab.icon} {tab.label} {tab.comingSoon ? '(即將推出)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          {/* Desktop: Horizontal tabs */}
          <nav className="hidden sm:flex space-x-1 lg:space-x-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.comingSoon && setActiveTab(tab.id)}
                disabled={tab.comingSoon}
                className={`py-3 lg:py-4 px-3 lg:px-6 border-b-2 font-medium text-sm lg:text-base whitespace-nowrap transition-all duration-300 ${
                  tab.comingSoon
                    ? 'border-transparent text-gray-400 bg-gray-100 cursor-not-allowed opacity-60'
                    : activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2 lg:mr-3">{tab.icon}</span>
                {tab.label}
                {tab.comingSoon && <span className="ml-2 text-xs text-gray-400">(即將推出)</span>}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8">
              <StatisticsCard
                title="舉辦活動"
                value={data.statistics?.hosted_events || 0}
                icon="📅"
                color="yellow"
              />
              <StatisticsCard
                title="即將舉行"
                value={data.statistics?.upcoming_events || 0}
                icon="⏰"
                color="purple"
              />
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
          <ClientManagement onRefresh={onRefresh} />
        )}

        {/* Events Management Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <StatisticsCard
                title="可參加活動"
                value={data.available_events?.length || 0}
                icon="📅"
                color="blue"
              />
              <StatisticsCard
                title="我的註冊"
                value={data.my_registrations?.length || 0}
                icon="✅"
                color="green"
              />
              <StatisticsCard
                title="客戶註冊"
                value={data.my_clients_registrations?.length || 0}
                icon="👥"
                color="yellow"
              />
              <StatisticsCard
                title="即將舉行"
                value={data.statistics?.upcoming_events || 0}
                icon="⏰"
                color="purple"
              />
            </div>

            {/* Available Events Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">🎯 可參加活動</h2>
                <span className="text-sm lg:text-base text-gray-500">
                  共 {data.available_events?.length || 0} 個活動
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {data.available_events?.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={handleEventRegistration}
                    onUnregister={handleEventUnregistration}
                    onViewDetails={handleViewEventDetails}
                    loading={loading}
                  />
                ))}
              </div>

              {/* Empty State for Available Events */}
              {(!data.available_events || data.available_events.length === 0) && (
                <div className="text-center py-8 sm:py-12 lg:py-16">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 max-w-md mx-auto">
                    <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-gray-400 mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-2">
                      暫無可參加活動
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-500">
                      請稍後再來查看新的活動
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* My Registrations Section */}
            {data.my_registrations && data.my_registrations.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">📋 我的註冊</h2>
                  <span className="text-sm lg:text-base text-gray-500">
                    共 {data.my_registrations.length} 個註冊
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {data.my_registrations.map((registration) => (
                    <EventCard
                      key={registration.id}
                      event={{
                        ...registration.event,
                        registration_status: registration.status,
                        is_registered: true
                      }}
                      onRegister={handleEventRegistration}
                      onUnregister={handleEventUnregistration}
                      onViewDetails={handleViewEventDetails}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* My Clients' Registrations Section */}
            {data.my_clients_registrations && data.my_clients_registrations.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">👥 我的客戶註冊</h2>
                  <span className="text-sm lg:text-base text-gray-500">
                    共 {data.my_clients_registrations.length} 個註冊
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {data.my_clients_registrations.map((registration) => (
                    <EventCard
                      key={registration.id}
                      event={{
                        ...registration.event,
                        registration_status: registration.status,
                        is_registered: true,
                        user: registration.user
                      }}
                      onRegister={handleEventRegistration}
                      onUnregister={handleEventUnregistration}
                      onViewDetails={handleViewEventDetails}
                      showClientInfo={true}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}





        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">部落格文章</h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2">瀏覽最新的財務規劃文章</p>
                  <button
                    onClick={() => window.open('/blogs', '_blank')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    查看所有文章
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">財務知識測驗</h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="mt-2">測試您的財務知識並賺取積分</p>
                  <button
                    onClick={() => window.open('/quizzes', '_blank')}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    開始測驗
                  </button>
                </div>
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

export default AgentDashboard; 