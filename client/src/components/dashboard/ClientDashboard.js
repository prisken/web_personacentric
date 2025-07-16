import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

const ClientDashboard = ({ data, onRefresh }) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('dashboard.client.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('dashboard.client.subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onRefresh}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {t('common.refresh')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {t('dashboard.client.eventsAttended')}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data.statistics?.total_events_attended || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {t('dashboard.client.pointsEarned')}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data.statistics?.total_points_earned || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {t('dashboard.client.pointsBalance')}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data.statistics?.points_balance || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {t('dashboard.client.contestsParticipated')}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data.contest_participations?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registered Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dashboard.client.registeredEvents')}
              </h3>
            </div>
            <div className="p-6">
              {data.registered_events?.length > 0 ? (
                <div className="space-y-4">
                  {data.registered_events.map((registration) => (
                    <div key={registration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {registration.event?.title}
                        </p>
                        <p className="text-sm text-gray-500">{registration.event?.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(registration.event?.start_date)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          registration.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                          registration.status === 'attended' ? 'bg-green-100 text-green-800' :
                          registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t(`registration.status.${registration.status}`)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {t('dashboard.client.noRegisteredEvents')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {t('dashboard.client.noRegisteredEventsDescription')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Available Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dashboard.client.availableEvents')}
              </h3>
            </div>
            <div className="p-6">
              {data.available_events?.length > 0 ? (
                <div className="space-y-4">
                  {data.available_events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-500">{event.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(event.start_date)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {t('event.status.upcoming')}
                        </span>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                          {t('common.register')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {t('dashboard.client.noAvailableEvents')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {t('dashboard.client.noAvailableEventsDescription')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade Application Status */}
        {data.upgrade_application && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dashboard.client.upgradeApplication')}
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t('dashboard.client.applicationStatus')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t(`upgrade.status.${data.upgrade_application.status}`)}
                  </p>
                  {data.upgrade_application.admin_feedback && (
                    <p className="text-xs text-gray-400 mt-1">
                      {data.upgrade_application.admin_feedback}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    data.upgrade_application.status === 'approved' ? 'bg-green-100 text-green-800' :
                    data.upgrade_application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    data.upgrade_application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {t(`upgrade.status.${data.upgrade_application.status}`)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(data.upgrade_application.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Point Transactions */}
        {data.recent_point_transactions?.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dashboard.client.recentPointTransactions')}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data.recent_point_transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t(`transaction.type.${transaction.transaction_type}`)}
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
            </div>
          </div>
        )}

        {/* Contest Participations */}
        {data.contest_participations?.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dashboard.client.contestParticipations')}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data.contest_participations.map((participation) => (
                  <div key={participation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {participation.contest?.title}
                      </p>
                      <p className="text-sm text-gray-500">{participation.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {t(`contest.category.${participation.content_type}`)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        participation.status === 'winner' ? 'bg-green-100 text-green-800' :
                        participation.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        participation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`contest.status.${participation.status}`)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(participation.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {data.notifications?.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dashboard.client.notifications')}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data.notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard; 