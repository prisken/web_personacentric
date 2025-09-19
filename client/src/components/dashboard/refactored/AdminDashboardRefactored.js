/**
 * Refactored Admin Dashboard
 * Demonstrates the improved structure using shared components and utilities
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import { formatHKD, formatDate } from '../../utils/format';
import { COMPONENT_CLASSES, RESPONSIVE_CLASSES } from '../../utils/responsive';
import { useLoading, useError, useAsync } from '../../hooks/useCommon';
import logger from '../../utils/logger';

// Shared Components
import Button from '../common/Button';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import Input from '../common/Input';

// Domain Services
import { eventService, dashboardService } from '../../services';

// Sub-components
import BlogManagement from './BlogManagement';
import GiftManagement from './GiftManagement';
import QuizManagement from './QuizManagement';
import EventDetailsOverlay from '../EventDetailsOverlay';
import StatisticsCard from './StatisticsCard';

const AdminDashboardRefactored = ({ data, onRefresh }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Custom hooks for state management
  const { loading, startLoading, stopLoading } = useLoading(false);
  const { error, setError, clearError } = useError();
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Async operations
  const { execute: fetchEvents, loading: eventsLoading } = useAsync(async () => {
    const response = await eventService.getEvents();
    if (response.success) {
      setEvents(response.events || []);
    } else {
      setEvents([]);
    }
    return response;
  });

  // Fetch events when events tab is active
  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents().catch(err => {
        setError('Failed to fetch events');
        logger.error('Failed to fetch events:', err);
      });
    }
  }, [activeTab, fetchEvents, setError]);

  const handleRefresh = async () => {
    try {
      startLoading();
      clearError();
      await onRefresh();
    } catch (err) {
      setError('Failed to refresh data');
      logger.error('Failed to refresh dashboard:', err);
    } finally {
      stopLoading();
    }
  };

  const handleEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleCloseEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  const tabs = [
    { id: 'overview', label: '總覽', icon: '📊' },
    { id: 'events', label: '活動管理', icon: '📅' },
    { id: 'blogs', label: '部落格管理', icon: '📝' },
    { id: 'gifts', label: '禮品管理', icon: '🎁' },
    { id: 'quizzes', label: '測驗管理', icon: '📋' }
  ];

  const renderTabNavigation = () => (
    <div className={COMPONENT_CLASSES.tabNav}>
      <div className={RESPONSIVE_CLASSES.container}>
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
              className={`${COMPONENT_CLASSES.tabButton} ${
                activeTab === tab.id
                  ? COMPONENT_CLASSES.tabButtonActive
                  : COMPONENT_CLASSES.tabButtonInactive
              }`}
            >
              <span className="mr-2 lg:mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className={RESPONSIVE_CLASSES.container}>
        <div className="flex flex-col space-y-4 py-4 sm:py-6 lg:py-8">
          <div className="text-center sm:text-left">
            <h1 className={COMPONENT_CLASSES.sectionHeader}>
              👑 管理員儀表板
            </h1>
            <p className={COMPONENT_CLASSES.sectionDescription}>
              管理平台內容和活動
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={handleRefresh}
              disabled={loading}
              loading={loading}
              variant="primary"
              size="medium"
            >
              {loading ? '更新中...' : '刷新數據'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className={RESPONSIVE_CLASSES.spacingSmall}>
      {/* Statistics Cards */}
      <div className={RESPONSIVE_CLASSES.gridCols3}>
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
        <Card title="最近註冊用戶">
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
        </Card>

        {/* Recent Payments */}
        <Card title="最近付款">
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
                  {formatHKD(payment.amount)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(payment.created_at)}
                </p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className={RESPONSIVE_CLASSES.spacingMedium}>
      {/* Statistics Cards */}
      <div className={RESPONSIVE_CLASSES.gridCols4}>
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
      <div className={RESPONSIVE_CLASSES.spacingSmall}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">📊 所有活動</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm lg:text-base text-gray-500">
              共 {data.all_events?.length || 0} 個活動
            </span>
            <Button
              onClick={() => navigate('/admin/events')}
              variant="primary"
              size="medium"
            >
              新增活動
            </Button>
          </div>
        </div>
        
        {eventsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="large" text="Loading events..." />
          </div>
        ) : (
          <div className={RESPONSIVE_CLASSES.gridCols3}>
            {data.all_events?.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105"
                padding="none"
              >
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
                    <Button
                      onClick={() => handleEventDetails(event)}
                      variant="success"
                      size="medium"
                      className="flex-1"
                    >
                      查看詳情
                    </Button>
                    
                    <Button
                      onClick={() => navigate(`/admin/events/${event.id}`)}
                      variant="primary"
                      size="medium"
                    >
                      編輯活動
                    </Button>
                    
                    <Button
                      onClick={() => navigate(`/admin/events/${event.id}/registrations`)}
                      variant="outline"
                      size="medium"
                    >
                      查看註冊
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!data.all_events || data.all_events.length === 0) && !eventsLoading && (
          <div className={COMPONENT_CLASSES.emptyState}>
            <Card className={COMPONENT_CLASSES.emptyStateContent}>
              <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-gray-400 mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-2">
                暫無活動
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-500">
                開始創建您的第一個活動
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'events':
        return renderEventsTab();
      case 'blogs':
        return <BlogManagement />;
      case 'gifts':
        return <GiftManagement />;
      case 'quizzes':
        return <QuizManagement />;
      default:
        return renderOverviewTab();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="primary">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {renderHeader()}
      {renderTabNavigation()}
      
      <div className={RESPONSIVE_CLASSES.container}>
        <div className="py-4 sm:py-6 lg:py-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Event Details Overlay */}
      <EventDetailsOverlay
        event={selectedEvent}
        isOpen={showEventDetails}
        onClose={handleCloseEventDetails}
        onRegistrationChange={onRefresh}
      />
    </div>
  );
};

export default AdminDashboardRefactored;











