import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import apiService from '../../services/api';
import EarnPointsTab from './EarnPointsTab';
import GiftRedemptionOverlay from '../GiftRedemptionOverlay';
import EventDetailsOverlay from '../EventDetailsOverlay';
import AgentRelationshipManagement from './AgentRelationshipManagement';
import EventCard from './EventCard';
import StatisticsCard from './StatisticsCard';

const ClientDashboard = ({ data, onRefresh }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGiftOverlay, setShowGiftOverlay] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const handleEventRegistration = async (eventId) => {
    try {
      setLoading(true);
      
      // Check if user is already registered for this event
      const isRegistered = data.registered_events?.some(reg => reg.event_id === eventId && reg.status === 'registered');
      
      if (isRegistered) {
        // Cancel registration
        await apiService.delete(`/events/${eventId}/register`);
        onRefresh();
        alert('活動註冊已取消！');
      } else {
        // Register for event
        await apiService.post(`/events/${eventId}/register`);
        onRefresh();
        alert('活動註冊成功！');
      }
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
    { id: 'overview', label: '總覽', icon: '📊' },
    { id: 'agent', label: '顧問連接', icon: '👥' },
    { id: 'events', label: '活動管理', icon: '📅' },
    { id: 'earn-points', label: '賺取積分', icon: '🎁' },
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

      {/* Points Display */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-lg lg:text-xl">🎯</span>
              </div>
              <div className="text-center">
                <p className="text-sm lg:text-base font-medium opacity-90">當前積分餘額</p>
                <p className="text-2xl lg:text-3xl xl:text-4xl font-bold">
                  {data.statistics?.points_balance || 0} 積分
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowGiftOverlay(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span className="text-lg lg:text-xl">🎁</span>
              <span>兌換禮品</span>
            </button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 lg:space-y-12">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <StatisticsCard
                title="投資總額"
                value="$50,000"
                icon="💰"
                color="blue"
              />
              <StatisticsCard
                title="投資回報"
                value="+12.5%"
                icon="📈"
                color="green"
                trend="+2.3%"
                trendDirection="up"
              />
              <StatisticsCard
                title="參與活動"
                value={data.statistics?.total_events_attended || 0}
                icon="📅"
                color="yellow"
              />
              <StatisticsCard
                title="積分餘額"
                value={data.statistics?.points_balance || 0}
                icon="🎯"
                color="purple"
              />
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
              <h3 className="text-lg font-medium text-gray-900">代理人關係管理</h3>
            </div>
            <div className="p-6">
              <AgentRelationshipManagement />
            </div>
          </div>
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
                title="已註冊活動"
                value={data.statistics?.total_events_registered || 0}
                icon="✅"
                color="green"
              />
              <StatisticsCard
                title="已參加活動"
                value={data.statistics?.total_events_attended || 0}
                icon="🎉"
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
            {data.registered_events && data.registered_events.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">📋 我的註冊</h2>
                  <span className="text-sm lg:text-base text-gray-500">
                    共 {data.registered_events.length} 個註冊
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {data.registered_events.map((registration) => (
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
          </div>
        )}

        {/* Earn Points Tab */}
        {activeTab === 'earn-points' && (
          <EarnPointsTab />
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

      {/* Gift Redemption Overlay */}
      <GiftRedemptionOverlay
        isOpen={showGiftOverlay}
        onClose={() => setShowGiftOverlay(false)}
        userPoints={data.statistics?.points_balance || 0}
        onPointsUpdate={onRefresh}
      />

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

export default ClientDashboard; 